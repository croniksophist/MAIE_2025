# Define the AWS region
$region = "us-east-1"

# Create required AWS resources for RBAC, SSO, and session management

# Step 1: Create User Groups in Cognito
$groups = @("Admin", "Editor", "Viewer")
foreach ($group in $groups) {
    Write-Host "Creating Cognito User Group: $group"
    aws cognito-idp create-group --group-name $group --user-pool-id "us-east-1_XXXXXXX" --region $region
}

# Step 2: Set up the RBAC Lambda Authorizer for API Gateway
$authorizerLambdaCode = @"
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  const token = event.authorizationToken;
  const decodedToken = jwt.decode(token);
  
  if (!decodedToken || !decodedToken['cognito:groups']) {
    return generatePolicy('user', 'Deny', event.methodArn);
  }

  const userGroups = decodedToken['cognito:groups'];
  
  if (userGroups.includes('Admin')) {
    return generatePolicy(decodedToken.sub, 'Allow', event.methodArn);
  } else {
    return generatePolicy(decodedToken.sub, 'Deny', event.methodArn);
  }
};

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}
"@

$lambdaZip = "RBACAuthorizer.zip"
Write-Host "Creating Lambda function for RBAC authorizer"
$authorizerLambdaCode | Out-File -FilePath $lambdaZip -Force
aws lambda create-function --function-name "RBACAuthorizer" --zip-file fileb://$lambdaZip --handler "index.handler" --runtime "nodejs14.x" --role "arn:aws:iam::YOUR_ACCOUNT_ID:role/your_lambda_execution_role" --region $region

# Step 3: Update AWS Amplify with RBAC configuration
$awsConfigFile = "aws-exports.js"
$awsConfig = @"
const awsConfig = {
  Auth: {
    region: "$region",
    userPoolId: "us-east-1_XXXXXXX",
    userPoolWebClientId: "XXXXXXXXXXXXXX",
    mfaConfiguration: "OPTIONAL",
  },
};
export default awsConfig;
"@
$awsConfig | Out-File -FilePath $awsConfigFile -Force

# Step 4: Set up SSO with Okta/Azure AD
$awsConfigSso = @"
const awsConfig = {
  Auth: {
    region: "$region",
    userPoolId: "us-east-1_XXXXXXX",
    userPoolWebClientId: "XXXXXXXXXXXXXX",
    oauth: {
      domain: "maie.auth.us-east-1.amazoncognito.com",
      scope: ["openid", "email", "profile"],
      redirectSignIn: "https://maie.com/callback",
      redirectSignOut: "https://maie.com/logout",
      responseType: "code",
    },
  },
};
export default awsConfig;
"@
$awsConfigSso | Out-File -FilePath $awsConfigFile -Force

# Step 5: Set up Lambda function for Magic Link (Passwordless Authentication)
$magicLinkLambdaCode = @"
const AWS = require('aws-sdk');
const crypto = require('crypto');
const cognito = new AWS.CognitoIdentityServiceProvider();
const ses = new AWS.SES();

exports.handler = async (event) => {
  const email = event.request.userAttributes.email;
  const token = crypto.randomBytes(20).toString('hex');
  await cognito.adminUpdateUserAttributes({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
    UserAttributes: [{ Name: 'custom:magicToken', Value: token }],
  }).promise();

  const loginUrl = `https://maie.com/login?token=${token}`;
  await ses.sendEmail({
    Source: 'no-reply@maie.com',
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: 'Your MAIE Login Link' },
      Body: { Text: { Data: `Click here to log in: ${loginUrl}` } },
    },
  }).promise();

  return { statusCode: 200, body: 'Login link sent!' };
};
"@
$magicLinkLambdaZip = "MagicLinkLambda.zip"
$magicLinkLambdaCode | Out-File -FilePath $magicLinkLambdaZip -Force
aws lambda create-function --function-name "MagicLinkFunction" --zip-file fileb://$magicLinkLambdaZip --handler "index.handler" --runtime "nodejs14.x" --role "arn:aws:iam::YOUR_ACCOUNT_ID:role/your_lambda_execution_role" --region $region

# Step 6: Enable CloudWatch Logging for Authentication Events
$authLoggingLambdaCode = @"
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatchLogs();

exports.handler = async (event) => {
  const logGroup = '/aws/cognito/auth-events';
  const logStream = new Date().toISOString().split('T')[0];

  const logData = JSON.stringify({
    eventType: event.triggerSource,
    user: event.userName,
    timestamp: new Date().toISOString(),
  });

  await cloudwatch.putLogEvents({
    logGroupName: logGroup,
    logStreamName: logStream,
    logEvents: [{ timestamp: Date.now(), message: logData }],
  }).promise();

  return event;
};
"@
$authLoggingLambdaZip = "AuthLoggingLambda.zip"
$authLoggingLambdaCode | Out-File -FilePath $authLoggingLambdaZip -Force
aws lambda create-function --function-name "AuthLoggingFunction" --zip-file fileb://$authLoggingLambdaZip --handler "index.handler" --runtime "nodejs14.x" --role "arn:aws:iam::YOUR_ACCOUNT_ID:role/your_lambda_execution_role" --region $region

# Step 7: Create Multi-Account Switching Logic in Cognito Lambda
$multiAccountLambdaCode = @"
exports.handler = async (event) => {
  const userAttributes = event.request.userAttributes;
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        'custom:accounts': userAttributes['custom:accounts'],
      },
    },
  };
  return event;
};
"@
$multiAccountLambdaZip = "MultiAccountLambda.zip"
$multiAccountLambdaCode | Out-File -FilePath $multiAccountLambdaZip -Force
aws lambda create-function --function-name "MultiAccountSwitchFunction" --zip-file fileb://$multiAccountLambdaZip --handler "index.handler" --runtime "nodejs14.x" --role "arn:aws:iam::YOUR_ACCOUNT_ID:role/your_lambda_execution_role" --region $region

Write-Host "All resources have been created successfully!"

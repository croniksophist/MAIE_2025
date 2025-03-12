# Define the root directory for the frontend project
$rootDir = "C:\maie-frontend"  # Modify this as needed
$directories = @(
    "$rootDir\src",
    "$rootDir\src\api",  # API request handlers
    "$rootDir\src\components",  # Reusable UI components
    "$rootDir\src\lambda",  # Lambda functions
    "$rootDir\src\services",  # Business logic (e.g., auth, notifications)
    "$rootDir\src\utils",  # Utility functions/helpers
    "$rootDir\config"  # Configuration files
)

# Create directories if they don't exist
foreach ($dir in $directories) {
    if (-not (Test-Path -Path $dir)) {
        New-Item -Path $dir -ItemType Directory
    }
}

# Create MFA Verification UI file
$mfaFile = "$rootDir\src\components\MFAInput.tsx"
$mfaCode = @"
import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const MFAInput = () => {
  const [mfaCode, setMfaCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyMFA(mfaCode);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={mfaCode}
        onChange={(e) => setMfaCode(e.target.value)} 
        placeholder="Enter MFA Code"
      />
      <button type="submit">Verify MFA</button>
    </form>
  );
};

const verifyMFA = async (code) => {
  try {
    await Auth.confirmSignIn(await Auth.currentAuthenticatedUser(), code, "SMS_MFA");
    alert("MFA Verified!");
  } catch (error) {
    console.error("MFA Verification Failed", error);
    alert("MFA verification failed. Please try again.");
  }
};

export default MFAInput;
"@
Set-Content -Path $mfaFile -Value $mfaCode

# Create Super-Admin Role file
$superAdminFile = "$rootDir\src\api\superAdminRole.ts"
$superAdminCode = @"
import { Auth, API } from "aws-amplify";

const fetchUsers = async () => {
  const session = await Auth.currentSession();
  const users = await API.get("adminApi", "/users", {
    headers: { Authorization: \`Bearer \${session.getIdToken().getJwtToken()}\` },
  });
  return users;
};

const updateUserRole = async (userId, role) => {
  await API.post("adminApi", "/updateRole", { body: { userId, role } });
};
"@
Set-Content -Path $superAdminFile -Value $superAdminCode

# Create Lambda function for suspicious login email notification
$lambdaFile = "$rootDir\src\lambda\suspiciousLoginNotification.ts"
$lambdaCode = @"
const AWS = require("aws-sdk");
const ses = new AWS.SES();

exports.handler = async (event) => {
  const { userName, request } = event;
  const location = request.context.geolocation;
  const ip = request.context.sourceIp;

  const message = \`Suspicious login detected for \${userName}.
  Location: \${location.city}, \${location.country}
  IP Address: \${ip}\`;

  await ses.sendEmail({
    Source: "security@maie.com",
    Destination: { ToAddresses: [userName] },
    Message: {
      Subject: { Data: "Suspicious Login Alert" },
      Body: { Text: { Data: message } },
    },
  }).promise();

  return event;
};
"@
Set-Content -Path $lambdaFile -Value $lambdaCode

# Create Claims Override Lambda file for SuperAdmin Role in JWT
$claimsOverrideFile = "$rootDir\src\lambda\claimsOverride.ts"
$claimsOverrideCode = @"
exports.handler = async (event) => {
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        "custom:role": event.request.userAttributes["cognito:groups"], 
      },
    },
  };
  return event;
};
"@
Set-Content -Path $claimsOverrideFile -Value $claimsOverrideCode

# Create config file for Cognito setup
$configFile = "$rootDir\config\cognitoConfig.json"
$configCode = @"
{
  "MFA": {
    "SMS": true,
    "TOTP": true,
    "WebAuthn": true
  },
  "SuperAdminRole": {
    "groupName": "SuperAdmin",
    "permissions": ["user_management", "logging", "monitoring"]
  },
  "SES": {
    "emailSource": "security@maie.com",
    "smtpConfig": {
      "host": "smtp.mailserver.com",
      "port": 587,
      "username": "your-smtp-username",
      "password": "your-smtp-password"
    }
  }
}
"@
Set-Content -Path $configFile -Value $configCode

Write-Host "Files and directories have been created successfully in the frontend project!"

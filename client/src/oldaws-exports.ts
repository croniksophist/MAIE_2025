const awsConfig = {
  Auth: {
    region: "us-east-1",  // AWS region
    userPoolId: "us-east-1_XXXXXXX", // Your Cognito User Pool ID
    userPoolWebClientId: "XXXXXXXXXXXXXX", // Your Cognito Web Client ID
    oauth: {
      domain: "maie.auth.us-east-1.amazoncognito.com",  // OAuth domain
      scopes: ["openid", "email", "profile"],  // OAuth scopes
      redirectSignIn: ["http://localhost:3000/"],  // Sign-in redirect URL
      redirectSignOut: ["http://localhost:3000/"], // Sign-out redirect URL
      responseType: "code",  // OAuth response type
    },
  },
};

export default awsConfig;

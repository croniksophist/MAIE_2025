const awsConfig = {
    Auth: {
      region: "us-east-1", // Ensure this matches your AWS region
      userPoolId: "us-east-1_XXXXXXX", // Your Cognito User Pool ID
      userPoolWebClientId: "XXXXXXXXXXXXXX", // Your Cognito Web Client ID
      authenticationFlowType: "USER_SRP_AUTH", // Required for Cognito authentication
  
      // MFA Configuration (Modify as needed)
      mfaConfiguration: "OPTIONAL", // Can be "OPTIONAL", "ON", or "OFF"
      mfaTypes: ["TOTP"], // Allow Time-based One-Time Password (TOTP)
      totpIssuer: "MAIE", // Issuer name for MFA apps (like Google Authenticator)
  
      // OAuth Configuration
      oauth: {
        domain: "maie.auth.us-east-1.amazoncognito.com",
        scope: ["openid", "email", "profile"],
        redirectSignIn: "http://localhost:3000/",
        redirectSignOut: "http://localhost:3000/",
        responseType: "code",
      },
  
      // Cookie Storage (Prevents login issues)
      cookieStorage: {
        domain: "localhost", // Change to your domain in production
        secure: false, // Set to true in production (https)
        path: "/",
        expires: 365, // Days until cookies expire
        sameSite: "lax",
      },
    },
  };
  
  export default awsConfig;
  
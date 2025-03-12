import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/index.css";
import "./styles/global.css";
import { Amplify } from "aws-amplify";
import awsConfig from "./aws-exports";
import { AuthProvider } from "react-oidc-context"; // Import OIDC Context
import { ThemeProvider } from './context/ThemeContext'; // Import your ThemeProvider

// Apply full AWS Amplify configuration
try {
  Amplify.configure(awsConfig as any); // Type assertion to avoid issues
  console.log("✅ AWS Amplify configured successfully");
} catch (error) {
  console.error("❌ Error configuring AWS Amplify:", error);
}

const cognitoAuthConfig = {
  authority: "https://maie.auth.us-east-1.amazoncognito.com",  // Cognito domain
  client_id: "XXXXXXXXXXXXXX",  // Your Web Client ID from Cognito
  redirect_uri: "http://localhost:3000/",  // Redirect URL after sign-in
  response_type: "code",  // OIDC flow type
  scope: "openid email profile",
};

// Ensure root element exists before rendering
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Ensure your index.html has a <div id='root'>.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          {/* Wrap your app with ThemeProvider and AuthProvider */}
          <ThemeProvider>
            <AuthProvider {...cognitoAuthConfig}>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

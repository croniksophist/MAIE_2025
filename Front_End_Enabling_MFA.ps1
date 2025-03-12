# Set the target directory for the project
$targetDirectory = "D:\Git\MAIE_Framework\MAIE_Frontend"

# 1. Update aws-exports.js (Add MFA and Social Login Configuration)
$awsExportsPath = "$targetDirectory\src\aws-exports.js"
$awsExportsContent = @"
const awsConfig = {
  Auth: {
    region: "us-east-1", // Change based on your AWS region
    userPoolId: "us-east-1_XXXXXXX",
    userPoolWebClientId: "XXXXXXXXXXXXXX",
    mfaConfiguration: "OPTIONAL", // Can be "OPTIONAL" or "REQUIRED"
    oauth: {
      domain: "maie.auth.us-east-1.amazoncognito.com",
      scope: ["openid", "email", "profile"],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: "code",
    },
  },
};
export default awsConfig;
"@
Set-Content -Path $awsExportsPath -Value $awsExportsContent

# 2. Update authSlice.js (Enable MFA and Social Login logic)
$authSlicePath = "$targetDirectory\src\store\authSlice.js"
$authSliceContent = @"
import { create } from "zustand";
import { Auth } from "@aws-amplify/auth";
import awsConfig from "../aws-exports";

Auth.configure(awsConfig);

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  register: async ({ email, password }) => {
    set({ loading: true });
    try {
      await Auth.signUp({ username: email, password, attributes: { email } });
      set({ loading: false });
      return "Verification code sent to email";
    } catch (error) {
      console.error("Registration failed:", error.message);
      set({ loading: false });
      return error.message;
    }
  },

  confirmSignUp: async ({ email, code }) => {
    set({ loading: true });
    try {
      await Auth.confirmSignUp(email, code);
      set({ loading: false });
      return "Account confirmed. You can now login.";
    } catch (error) {
      console.error("Confirmation failed:", error.message);
      set({ loading: false });
      return error.message;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const user = await Auth.signIn(email, password);
      set({ user, isAuthenticated: true, loading: false });
      return "Login successful";
    } catch (error) {
      console.error("Login failed:", error.message);
      set({ loading: false });
      return error.message;
    }
  },

  logout: async () => {
    await Auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  enableMFA: async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.setPreferredMFA(user, "TOTP");
      return "MFA Enabled Successfully";
    } catch (error) {
      return error.message;
    }
  },

  verifyMFA: async (code) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.verifyTotpToken(user, code);
      await Auth.setPreferredMFA(user, "TOTP");
      return "MFA Verified";
    } catch (error) {
      return error.message;
    }
  },

  socialLogin: async (provider) => {
    try {
      await Auth.federatedSignIn({ provider });
    } catch (error) {
      return error.message;
    }
  },
}));

export default useAuthStore;
"@
Set-Content -Path $authSlicePath -Value $authSliceContent

# 3. Create MFA Setup Component (MFASetup.js)
$mfaSetupPath = "$targetDirectory\src\components\MFASetup.js"
$mfaSetupContent = @"
import { useState } from "react";
import useAuthStore from "../store/authSlice";

const MFASetup = () => {
  const [code, setCode] = useState("");
  const enableMFA = useAuthStore((state) => state.enableMFA);
  const verifyMFA = useAuthStore((state) => state.verifyMFA);

  return (
    <div className="flex flex-col items-center">
      <button onClick={enableMFA} className="bg-blue-500 text-white px-4 py-2 rounded">
        Enable MFA
      </button>
      <input 
        type="text" 
        placeholder="Enter MFA Code" 
        value={code} 
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 mt-2"
      />
      <button onClick={() => verifyMFA(code)} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
        Verify MFA
      </button>
    </div>
  );
};

export default MFASetup;
"@
Set-Content -Path $mfaSetupPath -Value $mfaSetupContent

# 4. Create Social Login Component (SocialLogin.js)
$socialLoginPath = "$targetDirectory\src\components\SocialLogin.js"
$socialLoginContent = @"
import useAuthStore from "../store/authSlice";

const SocialLogin = () => {
  const socialLogin = useAuthStore((state) => state.socialLogin);

  return (
    <div className="flex flex-col items-center space-y-2">
      <button onClick={() => socialLogin("Google")} className="bg-red-500 text-white px-4 py-2 rounded">
        Sign in with Google
      </button>
      <button onClick={() => socialLogin("Facebook")} className="bg-blue-700 text-white px-4 py-2 rounded">
        Sign in with Facebook
      </button>
      <button onClick={() => socialLogin("Apple")} className="bg-black text-white px-4 py-2 rounded">
        Sign in with Apple
      </button>
    </div>
  );
};

export default SocialLogin;
"@
Set-Content -Path $socialLoginPath -Value $socialLoginContent

# 5. Create API Client for Secured API Calls (apiClient.js)
$apiClientPath = "$targetDirectory\src\services\apiClient.js"
$apiClientContent = @"
import axios from "axios";
import { Auth } from "@aws-amplify/auth";

const apiClient = axios.create({
  baseURL: "https://api.maie.com",
});

apiClient.interceptors.request.use(async (config) => {
  const user = await Auth.currentAuthenticatedUser();
  const token = user.signInUserSession.idToken.jwtToken;
  config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default apiClient;
"@
Set-Content -Path $apiClientPath -Value $apiClientContent

# 6. Create Dashboard Component to Call Protected API (Dashboard.js)
$dashboardPath = "$targetDirectory\src\components\Dashboard.js"
$dashboardContent = @"
import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/protected-endpoint");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
"@
Set-Content -Path $dashboardPath -Value $dashboardContent

Write-Host "PowerShell script executed successfully. Files have been created!"

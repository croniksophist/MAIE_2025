# Set the target directory for the project
$targetDirectory = "D:\Git\MAIE_Framework\MAIE_Frontend"

# Create the necessary folder structure
$folders = @(
    "$targetDirectory\src\store",
    "$targetDirectory\src\components",
    "$targetDirectory\src\services"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -Path $folder -ItemType Directory
    }
}

# 1. Create the AWS config file (aws-exports.js)
$awsExportsPath = "$targetDirectory\src\aws-exports.js"
$awsExportsContent = @"
const awsConfig = {
  Auth: {
    region: "us-east-1", // Change based on your AWS region
    userPoolId: "us-east-1_XXXXXXX",
    userPoolWebClientId: "XXXXXXXXXXXXXX",
  },
};

export default awsConfig;
"@
Set-Content -Path $awsExportsPath -Value $awsExportsContent

# 2. Create the Zustand Auth store (authSlice.js)
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
}));

export default useAuthStore;
"@
Set-Content -Path $authSlicePath -Value $authSliceContent

# 3. Create the LoginForm component
$loginFormPath = "$targetDirectory\src\components\LoginForm.js"
$loginFormContent = @"
import { useState } from "react";
import useAuthStore from "../store/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = await login({ email, password });
    alert(message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
"@
Set-Content -Path $loginFormPath -Value $loginFormContent

# 4. Create the PrivateRoute component
$privateRoutePath = "$targetDirectory\src\components\PrivateRoute.js"
$privateRouteContent = @"
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authSlice";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
"@
Set-Content -Path $privateRoutePath -Value $privateRouteContent

# 5. Create the RegisterForm component
$registerFormPath = "$targetDirectory\src\components\RegisterForm.js"
$registerFormContent = @"
import { useState } from "react";
import useAuthStore from "../store/authSlice";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = await register({ email, password });
    alert(message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
"@
Set-Content -Path $registerFormPath -Value $registerFormContent

# 6. Create the main App.js file (with routes)
$appJsPath = "$targetDirectory\src\App.js"
$appJsContent = @"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
"@
Set-Content -Path $appJsPath -Value $appJsContent

Write-Host "PowerShell script executed successfully. Files and folders have been created!"

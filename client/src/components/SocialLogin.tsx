import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { AppDispatch } from "../store/store";

const SocialLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSocialLogin = async (provider: string) => {
    try {
      // Simulating social login with provider as an email
      await dispatch(login({ email: `${provider}@social.com`, password: "" })).unwrap();
      alert(`Logged in with ${provider}`);
    } catch (err) {
      alert(`Failed to login with ${provider}: ${err}`);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={() => handleSocialLogin("Google")}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
      <button
        onClick={() => handleSocialLogin("Facebook")}
        className="bg-blue-700 text-white px-4 py-2 rounded"
      >
        Sign in with Facebook
      </button>
      <button
        onClick={() => handleSocialLogin("Apple")}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Sign in with Apple
      </button>
    </div>
  );
};

export default SocialLogin;

// src/components/MFASetup.tsx

import { useState, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store'; // Ensure correct path
import { enableMFA, verifyMFA } from '../store/slices/authSlice'; // Ensure these actions exist

const MFASetup: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  // Get state from Redux store
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleEnableMFA = () => {
    dispatch(enableMFA());
  };

  const handleVerifyMFA = () => {
    dispatch(verifyMFA(code));
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={handleEnableMFA} className="bg-blue-500 text-white px-4 py-2 rounded">
        Enable MFA
      </button>
      <input
        type="text"
        placeholder="Enter MFA Code"
        value={code}
        onChange={handleCodeChange}
        className="border p-2 mt-2"
      />
      <button
        onClick={handleVerifyMFA}
        className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
      >
        Verify MFA
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {isAuthenticated && <p className="text-green-500">MFA Verified!</p>}
    </div>
  );
};

export default MFASetup;

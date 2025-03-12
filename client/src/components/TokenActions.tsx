// src/components/TokenActions.tsx
import React from "react";
import useTokenManagement from "../hooks/useTokenManagement";

const TokenActions: React.FC = () => {
  const { getTokenBalance, spendTokens, earnTokens } = useTokenManagement(); // Custom hook for token management

  const handleSpendTokens = (amount: number) => {
    const success = spendTokens(amount);
    if (success) {
      console.log(`Successfully spent ${amount} tokens.`);
    }
  };

  const handleEarnTokens = (amount: number) => {
    earnTokens(amount);
    console.log(`You earned ${amount} tokens.`);
  };

  return (
    <div>
      <h2>Token Management</h2>
      <p>Current Balance: {getTokenBalance()} tokens</p>
      <button onClick={() => handleSpendTokens(10)}>Spend 10 Tokens</button>
      <button onClick={() => handleEarnTokens(10)}>Earn 10 Tokens</button>
    </div>
  );
};

export default TokenActions;

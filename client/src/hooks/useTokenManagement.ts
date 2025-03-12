// src/hooks/useTokenManagement.ts
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface TokenBalance {
  balance: number;
}

const useTokenManagement = () => {
  const { addNotification } = useAuth(); // Access notification function from AuthContext
  const [userTokens, setUserTokens] = useState<TokenBalance>({ balance: 100 }); // Initial token balance

  // Function to get token balance
  const getTokenBalance = (): number => {
    return userTokens.balance;
  };

  // Function to spend tokens
  const spendTokens = (amount: number): boolean => {
    if (userTokens.balance >= amount) {
      setUserTokens(prevTokens => ({
        balance: prevTokens.balance - amount,
      }));
      addNotification(`Successfully spent ${amount} tokens.`, 'info'); // Success notification
      return true;
    } else {
      addNotification(`Not enough tokens. You only have ${userTokens.balance} tokens left.`, 'error'); // Error notification
      return false;
    }
  };

  // Function to earn tokens
  const earnTokens = (amount: number): void => {
    setUserTokens(prevTokens => ({
      balance: prevTokens.balance + amount,
    }));
    addNotification(`You earned ${amount} tokens.`, 'info'); // Success notification
  };

  return {
    getTokenBalance,
    spendTokens,
    earnTokens,
  };
};

export default useTokenManagement;

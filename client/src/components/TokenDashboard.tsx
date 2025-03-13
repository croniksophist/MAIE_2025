// MAIE_Framework_2.0/client/src/components/TokenDashboard.tsx

import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { getTokenBalance, spendTokens, earnTokens } from "../services/tokenService";

const TokenDashboard: React.FC = () => {
  const [balance, setBalance] = useState(getTokenBalance());

  const handleSpend = () => {
    if (spendTokens(10)) {
      setBalance(getTokenBalance());
    } else {
      alert("Not enough tokens!");
    }
  };

  const handleEarn = () => {
    earnTokens(10);
    setBalance(getTokenBalance());
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Token Balance: {balance} MAIE Tokens
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ margin: "10px" }}
        onClick={handleSpend}
      >
        Spend 10 Tokens
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ margin: "10px" }}
        onClick={handleEarn}
      >
        Earn 10 Tokens
      </Button>
    </Box>
  );
};

export default TokenDashboard;

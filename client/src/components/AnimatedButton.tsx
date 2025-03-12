// File: client/src/components/AnimatedButton.tsx

import React from "react";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  label: string;
  onClick: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ label, onClick }) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }}
      className="animated-button"
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default AnimatedButton;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WelcomeMessageProps {
  username: string;
  isPremium: boolean;
}

/**
 * Dynamic welcome message component with rotating greetings
 */
export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  username,
  isPremium,
}) => {
  // Array of greeting variations to rotate through
  const greetings = [
    { text: "Welcome back", emoji: "👋" },
    { text: "Great to see you", emoji: "✨" },
    { text: "Hello there", emoji: "🌟" },
    { text: "Ready to learn", emoji: "📚" },
    { text: "Let's continue", emoji: "🚀" },
    { text: "Back to studies", emoji: "💡" },
  ];

  // Time-based greeting
  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 17) return "Good afternoon";
    if (hours < 21) return "Good evening";
    return "Good night";
  };

  // Select a random greeting but weighted toward time-based greeting
  const selectGreeting = () => {
    // 40% chance to use time-based greeting
    if (Math.random() < 0.4) {
      return { text: getTimeBasedGreeting(), emoji: "🕒" };
    }

    // Otherwise select a random greeting from the list
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  };

  const [currentGreeting, setCurrentGreeting] = useState(selectGreeting());

  // Refresh greeting when component mounts
  useEffect(() => {
    setCurrentGreeting(selectGreeting());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col space-y-2'
    >
      <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
        <span className='mr-2'>{currentGreeting.text}</span>
        <span className='text-blue-600 dark:text-blue-400 capitalize'>
          {username}
        </span>
        <motion.span
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 10, scale: 1.1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            duration: 0.6,
          }}
          className='inline-block ml-2'
        >
          {currentGreeting.emoji}
        </motion.span>
      </h1>

      <p className='text-lg text-gray-700 dark:text-gray-300'>
        {!username || username === "Guest"
          ? "Create subjects to start your learning journey!"
          : "Continue your learning journey today"}
      </p>
    </motion.div>
  );
};

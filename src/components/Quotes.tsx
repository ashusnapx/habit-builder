"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import ShinyBadge from "./ShinyBadge";

// Define interface for quotes
interface Quote {
  text: string;
  author: string;
}

// Initialize Gemini API
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API;
if (!apiKey) {
  throw new Error(
    "API key is missing. Please set NEXT_PUBLIC_GOOGLE_GEMINI_API in your environment."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generateQuote = async (subject: string): Promise<Quote[]> => {
  try {
    const prompt = `Generate one high-quality, random and insightful quote directly relevant to the key themes, concepts, and topics within the ${subject} syllabus for the UPSC civil services examination. Only quote, nothing, no explanation, nothing, be to the point, crisp, precise and do mention the author.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    // Extract quotes from response
    const quotes: Quote[] = result.response
      .text()
      .split("\n")
      .filter((line) => line.trim() !== "") // Remove empty lines
      .map((quoteText, index) => ({
        text: quoteText.trim(),
        author: `Author ${index + 1}`,
      }));
    return quotes;
  } catch (error) {
    console.error("Error generating quotes:", error);
    return [];
  }
};

const Quotes = () => {
  const [groupedQuotes, setGroupedQuotes] = useState<{
    [key: string]: Quote[];
  }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const subjects = ["GS1", "GS2", "GS3", "GS4"];

  useEffect(() => {
    const fetchQuotes = async () => {
      const quotesBySubject: { [key: string]: Quote[] } = {};
      for (const subject of subjects) {
        const subjectQuotes = await generateQuote(subject);
        quotesBySubject[subject] = subjectQuotes;
      }
      setGroupedQuotes(quotesBySubject);
    };
    fetchQuotes();
  }, []);

  // Function to handle swipe action
  const handleNavigation = (direction: number) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return subjects.length - 1;
      if (newIndex >= subjects.length) return 0;
      return newIndex;
    });
  };

  return (
    <div className='md:p-6 mt-16 overflow-hidden relative'>
      <motion.div
        className='flex flex-row items-center text-center justify-center gap-3'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className='text-2xl font-semibold tracking-tighter capitalize text-gray-800 dark:text-gray-200 '>
          Artificial Intelligence Powered Quotes
        </h1>
        <ShinyBadge label='Beta' />
      </motion.div>
      <div className='w-full max-w-screen-md mx-auto mt-1'>
        <AnimatePresence>
          {subjects.map(
            (subject, index) =>
              index === currentIndex && (
                <motion.div
                  key={subject}
                  className='p-4'
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className='bg-white dark:bg-gray-800 shadow-lg md:h-48 overflow-y-auto'>
                    <CardContent className='p-6'>
                      <h2 className='text-xl font-bold mb-4 tracking-wide'>{`${subject} Related Quotes:`}</h2>

                      {groupedQuotes[subject]?.map((quote, index) => (
                        <motion.div
                          key={index}
                          className='mb-4'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ReactMarkdown className='text-lg italic'>
                            {quote.text}
                          </ReactMarkdown>
                        </motion.div>
                      ))}
                      <div className='flex justify-between mt-4'>
                        <button
                          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                          onClick={() => handleNavigation(-1)}
                        >
                          Previous
                        </button>
                        <button
                          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                          onClick={() => handleNavigation(1)}
                        >
                          Next
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quotes;

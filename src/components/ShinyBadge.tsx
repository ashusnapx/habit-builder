import { motion } from "framer-motion";
import { Badge } from "./ui/badge"; // Adjust import path as needed

interface ShinyBadgeProps {
  label: string;
}

const ShinyBadge: React.FC<ShinyBadgeProps> = ({ label }) => {
  return (
    <motion.div
      className='relative inline-block'
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0.7, 1] }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
    >
      <Badge className='w-fit text-base relative overflow-hidden'>
        {label}
        <motion.div
          className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white opacity-30'
          initial={{ x: "-100%" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
        />
      </Badge>
    </motion.div>
  );
};

export default ShinyBadge;

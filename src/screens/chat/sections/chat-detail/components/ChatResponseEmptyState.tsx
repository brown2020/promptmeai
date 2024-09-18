import { useUser } from "@clerk/nextjs";
import { MdWavingHand } from "react-icons/md";
import { motion } from "framer-motion";

const ChatResponseEmptyState = () => {
  const { user } = useUser();

  return (
    <div className="h-full flex flex-col justify-center items-center gap-1">
      <motion.div
        className="bg-[#464646] p-3 rounded-2xl mb-4"
        initial={{ scale: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          transition: { duration: 0.6 },
        }}
      >
        <MdWavingHand color="#E8E8E8" size={32} />
      </motion.div>

      <motion.span
        className="text-xl text-[#9F969C]"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.2 },
        }}
      >
        Hi, {user && user.fullName}
      </motion.span>
      <motion.span
        className="text-xl text-[#53494D]"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.4 },
        }}
      >
        What can I help with?
      </motion.span>
    </div>
  );
};

export default ChatResponseEmptyState;

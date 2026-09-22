import { MdWavingHand } from "react-icons/md";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Fragment } from "react";
import Spinner from "@/components/Spinner";
import { auth } from "@/firebase/firebaseClient";

const ChatResponseEmptyState = () => {
  const user = auth.currentUser;

  return (
    <LazyMotion features={domAnimation}>
    <div className="h-full flex flex-col justify-center items-center gap-1">
      {!user ? (
        <Spinner message="Setting things up for you..." />
      ) : (
        <Fragment>
          <m.div
            className="bg-[#464646] dark:bg-[#1E1F22] p-3 rounded-2xl mb-4"
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              transition: { duration: 0.6 },
            }}
          >
            <MdWavingHand color="#E8E8E8" size={32} />
          </m.div>

          <m.span
            className="text-xl text-[#5C5659] dark:text-[#D8D8D8]"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.2 },
            }}
          >
            Hi, {user && user.displayName}
          </m.span>
          <m.span
            className="text-xl text-[#53494D] dark:text-[#EEE]"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: 0.4 },
            }}
          >
            What can I help with?
          </m.span>
        </Fragment>
      )}
    </div>
    </LazyMotion>
  );
};

export default ChatResponseEmptyState;

import { PropsWithChildren } from "react";
import { GiBrainTentacle } from "react-icons/gi";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-r from-teal-800 dark:from-[#272A2D] via-teal-700 dark:via-[#272A2D] to-teal-500 dark:to-[#272A2D] text-gray-800">
      <div className="grid lg:grid-cols-2 items-center gap-6 max-w-md lg:max-w-6xl w-full h-full mx-auto p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <GiBrainTentacle size={64} color="#FFFFFF" />
          <h2 className="text-4xl font-extrabold lg:leading-[50px] text-white dark:text-[#EEE]">
            Welcome to Prompt.me
          </h2>
          <p className="text-white dark:text-[#EEE]">
            This demo showcases the capabilities of Prompt.me, a powerful tool
            that allows you to run the same prompts across leading AI models
            simultaneously, including OpenAI, Anthropic, Gemini, Llama, and
            Mistral. Sign in to start exploring the differences and strengths of
            each model, or learn more about how Prompt.me can help you make
            informed decisions in your AI projects.
          </p>
        </div>

        <div className="flex flex-col justify-center h-full lg:pb-0 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

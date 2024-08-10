"use client";

import { useState } from "react";
import { ModelChat } from "./ModelChat";
import { type CoreMessage } from "ai";
import { MODELNAMES } from "@/constants/modelNames";
import { continueConversation } from "@/lib/generateActions";
import { readStreamableValue } from "ai/rsc";
import { useChatStore } from "@/zustand/useChatStore";

export default function ChatCompare() {
  const [input, setInput] = useState("");
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUserMessage: CoreMessage = { content: input, role: "user" };

    MODELNAMES.forEach((model) => {
      // Add the user message to the conversation
      addMessage(model, newUserMessage);

      // Get assistant response for each model
      getAssistantResponse(model, newUserMessage);
    });

    setInput("");
  };

  const getAssistantResponse = async (
    model: string,
    userMessage: CoreMessage
  ) => {
    const currentMessages = useChatStore.getState().messages[model] || [];

    const result = await continueConversation(currentMessages, model);
    for await (const content of readStreamableValue(result)) {
      setMessages(model, [
        ...currentMessages,
        {
          role: "assistant",
          content: content as string,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl py-24 mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {MODELNAMES.map((model) => (
          <ModelChat key={model} model={model} />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-4xl p-4 bg-white"
      >
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}

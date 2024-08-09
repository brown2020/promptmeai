"use client";

import { useState } from "react";
import { ModelChat } from "./ModelChat";
import { type CoreMessage } from "ai";

const MODELNAMES = [
  "gpt-4o",
  "gemini-1.5-pro",
  "mistral-large",
  "claude-3-5-sonnet",
  "llama-v3p1-405b-instruct",
];

export default function ChatCompare() {
  const [input, setInput] = useState("");
  const [userMessage, setUserMessage] = useState<CoreMessage | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUserMessage: CoreMessage = { content: input, role: "user" };
    setUserMessage(newUserMessage);
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-6xl py-24 mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {MODELNAMES.map((model) => (
          <ModelChat key={model} model={model} userMessage={userMessage} />
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

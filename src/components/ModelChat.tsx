"use client";

import { useChatStore } from "@/zustand/useChatStore";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";

interface ModelChatProps {
  model: { label: string; value: string };
}

export const ModelChat: React.FC<ModelChatProps> = ({ model }) => {
  const messages = useChatStore((state) => state.messages[model.value] || []);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-8 mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">{model.label}</h2>
      <div className="space-y-4 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {m.role === "user" ? "User: " : `AI: `}
            <Markdown>{m.content as string}</Markdown>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

"use client";

import { type CoreMessage } from "ai";
import { useState, useEffect, useRef } from "react";
import { readStreamableValue } from "ai/rsc";
import { continueConversation } from "@/lib/generateActions";

interface ModelChatProps {
  model: string;
  userMessage: CoreMessage | null;
}

export const ModelChat: React.FC<ModelChatProps> = ({ model, userMessage }) => {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getAssistantResponse = async (newMessages: CoreMessage[]) => {
      const result = await continueConversation(newMessages, model);
      for await (const content of readStreamableValue(result)) {
        setMessages((prevMessages) => [
          ...newMessages,
          {
            role: "assistant",
            content: content as string,
          },
        ]);
      }
    };

    if (userMessage) {
      const newMessages: CoreMessage[] = [...messages, userMessage];
      setMessages(newMessages);
      getAssistantResponse(newMessages);
    }
  }, [userMessage]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-md py-8 mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-4">{model}</h2>
      <div className="space-y-4 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {m.role === "user" ? "User: " : `AI (${model}): `}
            {m.content as string}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
};

"use client";

import { MODELNAMES } from "@/constants/modelNames";
import { useChatStore } from "@/zustand/useChatStore";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";

export const ModelChat: React.FC = () => {
  const messages = useChatStore.getState().messages || [];
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
  messages.map((message, index) => (
      <div key={index} className="border-b pb-4">
        <div className="flex flex-col items-end">
          <div className="w-max mb-2 border rounded-lg bg-blue-400 p-2 shadow-sm">
            <div className="text-left text-white">
              {typeof message.userMessage.content === 'string'
                ? message.userMessage.content
                : JSON.stringify(message.userMessage.content)}
            </div>
          </div>
        </div>
        <div className="space-y-2 mt-2">
          {MODELNAMES.map((model) => {
            const response = message.responses[model.value];
            return response ? (
              <div key={model.value} className="p-2 border rounded-lg bg-gray-100 shadow-sm">
                <div className="font-semibold text-gray-700">{model.label}:</div>
                <div className="mt-2 text-gray-600 pt-2 px-10">
                  <Markdown>{response.content as string}</Markdown>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    ))
  )
};

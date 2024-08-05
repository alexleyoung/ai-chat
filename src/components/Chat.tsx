"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

export default function Chat({ className }: { className?: String }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your personal assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages
    setIsLoading(true);

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok || !response.body) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    // message box
    <div
      className={cn("size-full p-4 flex flex-col justify-between", className)}>
      {/* messages */}
      <div className='flex flex-col gap-2'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "py-2 px-4 rounded-lg inline-block max-w-[80%] break-words",
              message.role === "assistant"
                ? "bg-primary/80 text-white self-start"
                : "bg-accent text-foreground self-end"
            )}>
            {message.content}
          </div>
        ))}
      </div>
      {/* message input */}
      <div className='flex gap-2 bg-accent'>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='w-full'
          onKeyDown={handleKeyPress}
          placeholder='Send message...'
        />
        <Button>
          <SendHorizontal onClick={sendMessage} />
        </Button>
      </div>
    </div>
  );
}

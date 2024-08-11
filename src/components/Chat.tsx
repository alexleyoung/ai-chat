"use client";

import { cn, messageRowToMessages } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Message = {
  role: string;
  content: String | null;
};

export default function Chat({
  className,
  sessionMessages,
  sessionId,
}: {
  className?: String;
  sessionMessages?: Database["public"]["Tables"]["messages"]["Row"][];
  sessionId: String;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionMessages) {
      setMessages(messageRowToMessages(sessionMessages));
    }
  }, [sessionMessages]);

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages
    setIsLoading(true);
    const supabase = createClient();

    if (messages.length === 0) {
      console.log("hello");
      const { error } = await supabase
        .from("chat_sessions")
        .update({ session_name: message })
        .eq("id", sessionId);
      if (error) {
        console.error(error);
      }
    }

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    // insert user message into DB
    await supabase.from("messages").insert({
      session_id: sessionId,
      sender: "user",
      content: message,
    });

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
      // insert ai message into DB
      await supabase.from("messages").insert({
        session_id: sessionId,
        sender: "assistant",
        content: messagesRef.current.at(-1)?.content || "",
      });
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

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (!messagesEndRef || !messagesEndRef.current) {
      return;
    }
    (messagesEndRef.current as HTMLElement).scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    // message box
    <div
      className={cn("size-full p-8 flex flex-col justify-between", className)}>
      {/* messages */}
      <div className='flex flex-col gap-10 h-full overflow-scroll px-8'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "py-2 px-4 rounded-lg inline-block max-w-[70%] break-words",
              message.role === "assistant"
                ? "bg-primary/80 text-primary-foreground self-start"
                : "bg-accent text-primary self-end"
            )}>
            {message.content}
          </div>
        ))}
      </div>
      {/* message input */}
      <div className='flex gap-4 justify-center items-center'>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='rounded-md bg-accent'
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

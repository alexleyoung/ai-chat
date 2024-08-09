"use client";

import Chat from "@/components/Chat";

import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const ChatSession = () => {
  const [messages, setMessages] =
    useState<Database["public"]["Tables"]["messages"]["Row"][]>();
  const [session, setSession] =
    useState<Database["public"]["Tables"]["chat_sessions"]["Row"]>();

  // get the pathname for session ID
  const pathname = usePathname();

  // fetch session by ID
  const getSession = async () => {
    const supabase = createClient();
    const sessionId = pathname.split("/")[2];
    const { data, error } = await supabase
      .from("chat_sessions")
      .select()
      .eq("id", sessionId);

    if (error) {
      console.error(error);
      return null;
    }
    setSession(() => data[0]);
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <div className='ml-96 h-screen w-full'>
      <Chat />
    </div>
  );
};

export default ChatSession;

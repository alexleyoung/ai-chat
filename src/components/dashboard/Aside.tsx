"use client";

import { signOut } from "@/actions/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Aside = () => {
  const [userId, setUserId] = useState("");
  const [sessions, setSessions] =
    useState<Database["public"]["Tables"]["chat_sessions"]["Row"][]>();

  const router = useRouter();

  const getSessions = async () => {
    const supabase = createClient();

    // get user id
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    setUserId(user.id);

    // get user sessions
    const { data, error } = await supabase
      .from("chat_sessions")
      .select()
      .eq("user_id", user.id);
    data && setSessions(data);
  };

  useEffect(() => {
    getSessions();
  }, [sessions]);

  return (
    <aside className='fixed w-96 h-screen bg-accent p-8 flex flex-col justify-between items-start'>
      <div className='flex flex-col items-center gap-8'>
        <h2 className='text-primary text-2xl'>Chats</h2>
        <Button
          onClick={async () => {
            const supabase = createClient();
            const { data, error } = await supabase
              .from("chat_sessions")
              .insert([{ user_id: userId, session_name: "New Chat" }]);
            if (error) {
              console.error(error);
              return null;
            }
            getSessions();
          }}>
          start a new chat
        </Button>
        <nav className='flex flex-col gap-4'>
          {sessions?.map((session) => (
            <Link key={session.id} href={`/dashboard/${session.id}`}>
              {session.session_name}
            </Link>
          ))}
        </nav>
      </div>
      <div className='flex justify-between w-full'>
        <ThemeToggle />
        <Button
          onClick={() => {
            signOut();
            router.push("/");
          }}>
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Aside;

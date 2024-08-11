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
      <div className='flex flex-col items-left gap-8'>
        <div className='flex flex-row items-center gap-24'>
          <h1
            className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            <Link href="/dashboard">Chats</Link>
          </h1>
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
            }}
            className="transition duration-300 ease-in-out hover:bg-blue-500">
            New Chat
          </Button>
        </div>
        <nav className='flex flex-col gap-4'>
          {sessions?.map((session) => (
            <Link key={session.id} href={`/dashboard/${session.id}`}   
              className="transition duration-300 ease-in-out transform hover:scale-105 hover:text-gray-500">
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

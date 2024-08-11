"use client";

import { signOut } from "@/actions/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { createClient } from "@/utils/supabase/client";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MAX_LENGTH = 27;

const Aside = ({ className }: { className: string }) => {
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
    <aside
      className={cn(
        "fixed h-screen bg-accent p-8 flex flex-col justify-between items-start",
        className
      )}>
      <div className='flex flex-col items-left gap-8'>
        <div className='flex flex-row items-center gap-24'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl'>
            <Link href='/dashboard'>Chats</Link>
          </h1>
          <Button
            onClick={async () => {
              const supabase = createClient();
              const { data, error } = await supabase
                .from("chat_sessions")
                .insert([{ user_id: userId, session_name: "New Chat" }])
                .select();

              if (error) {
                console.error(error);
                return null;
              }
              getSessions();
              router.push(`/dashboard/${data[0].id}`);
            }}
            className='transition duration-300 ease-in-out hover:bg-blue-500'>
            New Chat
          </Button>
        </div>
        <nav className='flex flex-col gap-4'>
          {sessions?.map((session) => (
            <div className='flex justify-between items-center gap-2'>
              <Link
                key={session.id}
                href={`/dashboard/${session.id}`}
                className='w-full rounded-md p-2 hover:bg-primary/5 transition duration-300 ease-in-out transform hover:scale-105'>
                {session.session_name.length > MAX_LENGTH
                  ? session.session_name.slice(0, MAX_LENGTH) + "..."
                  : session.session_name}
              </Link>
              <div className='flex'>
                <Button
                  variant='ghost'
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase
                      .from("chat_sessions")
                      .delete()
                      .eq("id", session.id);
                    getSessions();
                  }}>
                  <Trash className='hover:text-blue-500 transition-colors' />
                </Button>
              </div>
            </div>
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

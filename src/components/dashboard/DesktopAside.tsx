"use client";

import { signOut } from "@/actions/auth";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createClient } from "@/utils/supabase/client";

const DesktopAside = ({
  className,
  maxSessionNameLength,
  userId,
  sessions,
  router,
  getSessions,
}: {
  className?: string;
  maxSessionNameLength: number;
  userId: string;
  sessions: chatSession[];
  router: AppRouterInstance;
  getSessions: () => void;
}) => {
  return (
    <aside
      className={cn(
        "h-screen bg-accent p-8 lg:flex flex-col justify-between items-start hidden",
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
            <div
              key={session.id}
              className='flex justify-between items-center gap-2'>
              <Link
                href={`/dashboard/${session.id}`}
                className='w-full rounded-md p-2 hover:bg-primary/5 transition duration-300 ease-in-out transform hover:scale-105'>
                {session.session_name.length > maxSessionNameLength
                  ? session.session_name.slice(0, maxSessionNameLength) + "..."
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
            router.push("/login");
          }}>
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default DesktopAside;

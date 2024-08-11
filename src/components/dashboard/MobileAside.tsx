"use client";

import { LogOut, Menu, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/actions/auth";

const MobileAside = ({
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
    <aside className='w-16 bg-primary/5 lg:hidden flex flex-col justify-between items-center py-6'>
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side='left' className='border-accent'>
          <SheetHeader>
            <SheetTitle>
              <Link href='/dashboard'>Chatbot</Link>
            </SheetTitle>
            <SheetDescription>
              <nav className='flex flex-col gap-4'>
                {sessions?.map((session) => (
                  <div
                    key={session.id}
                    className='flex justify-between items-center gap-2'>
                    <Link
                      href={`/dashboard/${session.id}`}
                      className='w-full rounded-md p-2 hover:bg-primary/5 transition duration-300 ease-in-out transform hover:scale-105'>
                      {session.session_name.length > maxSessionNameLength
                        ? session.session_name.slice(0, maxSessionNameLength) +
                          "..."
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
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <LogOut
        onClick={() => {
          signOut();
          router.push("/login");
        }}
      />
    </aside>
  );
};

export default MobileAside;

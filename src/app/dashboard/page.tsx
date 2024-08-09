"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userId, setUserId] = useState("");
  const [sessions, setSessions] =
    useState<Database["public"]["Tables"]["chat_sessions"]["Row"][]>();

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <section className='ml-96 grid place-items-center h-screen w-full'>
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
          console.log(data);
        }}>
        start a new chat
      </Button>
    </section>
  );
}

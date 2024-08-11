"use client";

import DesktopAside from "@/components/dashboard/DesktopAside";
import MobileAside from "@/components/dashboard/MobileAside";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_LENGTH = 27;

const Aside = ({ className }: { className: string }) => {
  const [userId, setUserId] = useState("");
  const [sessions, setSessions] = useState<chatSession[]>([]);
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
    <>
      <DesktopAside
        maxSessionNameLength={MAX_LENGTH}
        userId={userId}
        sessions={sessions}
        router={router}
        getSessions={getSessions}
      />
      <MobileAside
        maxSessionNameLength={MAX_LENGTH}
        userId={userId}
        sessions={sessions}
        router={router}
        getSessions={getSessions}
      />
    </>
  );
};

export default Aside;

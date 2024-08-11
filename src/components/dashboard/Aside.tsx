"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import DesktopAside from "@/components/dashboard/DesktopAside";
import { useRouter } from "next/navigation";

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
        userId={userId}
        sessions={sessions}
        router={router}
        getSessions={getSessions}
      />
    </>
  );
};

export default Aside;

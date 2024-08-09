import Chat from "@/components/Chat";
import { createClient } from "@/utils/supabase/server";

type ChatSessionProps = { params: { slug: string }; userId: string };

export async function generateStaticParams(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("user_id", userId);

  return data?.map((session) => ({ params: { slug: session.id } }));
}

const ChatSession = async ({ params }: ChatSessionProps) => {
  const supabase = createClient();

  const sessionId = params.slug;
  console.log(sessionId);

  const { data, error } = await supabase
    .from("chat_sessions")
    .select()
    .eq("user_id", 1)
    .eq("id", sessionId);

  return <Chat className='ml-96 h-screen' />;
};

export default ChatSession;

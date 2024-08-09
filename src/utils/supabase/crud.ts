import { createClient } from "./server";

export const getUserSessions = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select()
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const getUserSession = async (userId: string, slug: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select()
    .eq("user_id", userId)
    .eq("id", slug);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const createSession = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([{ user_id: userId }]);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

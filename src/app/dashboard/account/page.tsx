import AccountForm from "@/components/auth/AccountForm";
import { createClient } from "@/utils/supabase/server";

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <AccountForm user={user} />
    </>
  );
}

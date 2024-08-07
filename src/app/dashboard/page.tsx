import Chat from "@/components/Chat";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";

import ThemeToggle from "@/components/ThemeToggle";

export default async function Dashboard() {
  const supabase = createClient();

  return (
    <section className='flex'>
      <aside className='fixed w-96 h-screen bg-accent p-8'>
        <ThemeToggle />
      </aside>
      <Chat className='h-screen ml-96' />
    </section>
  );
}

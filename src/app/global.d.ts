import { Database as DB } from "@/lib/database.types";

declare global {
  type Database = DB;
  type chatSession = Database["public"]["Tables"]["chat_sessions"]["Row"];
}

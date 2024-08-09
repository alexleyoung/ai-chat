import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function messageRowToMessages(
  messageRow: Database["public"]["Tables"]["messages"]["Row"][]
) {
  type Message = {
    role: string;
    content: String | null;
  };
  let res: Message[] = [];

  messageRow.forEach((message) => {
    res.push({
      role: message.sender,
      content: message.content,
    });
  });

  return res;
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login, signInWithGithub } from "@/actions/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginForm({ className }: { className?: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Form {...form}>
        <Button onClick={() => signInWithGithub()} className='w-full'>
          Github
        </Button>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='user@email.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='abc123' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Login</Button>
          <p>
            Don{"'"}t have an account?{" "}
            <Link href='/signup' className='font-medium text-blue-500'>
              Sign up here.
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}

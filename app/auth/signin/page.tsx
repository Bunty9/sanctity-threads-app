"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Signin() {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full flex flex-col gap-4">
            <FormField 
            control={form.control} 
            name="email"
            render={({ field }) => {
                return <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input  placeholder="email" type="email" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            }}
            />
            <FormField 
            control={form.control} 
            name="password"
            render={({ field }) => {
                return <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input  placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            }}
            />
            <Button type="submit">Sign In</Button>
        </form>
      </Form>
    </main>
  );
}
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirm: z.string()
}).refine( (data) => {
    return data.password === data.passwordConfirm
} , {
    message: "Passwords do not match",
    path: ["passwordConfirm"]
});

export default function Signup() {
    const router = useRouter()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
    //route to onboarding
    router.push('/auth/onboarding')
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
            <FormField 
            control={form.control} 
            name="passwordConfirm"
            render={({ field }) => {
                return <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <Input  placeholder="confirm password" type="password" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            }}
            />
            <Button type="submit">Sign Up</Button>
        </form>
      </Form>
    </main>
  );
}

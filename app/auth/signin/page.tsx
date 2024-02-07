"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseClient";
import { useRouter } from "next/navigation";


const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Signin() {
  const router = useRouter()
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: any) => {
    await signInWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
        const user = userCredential.user
        if(user){
            console.log(user)
            router.push('/')
        }
    }
    ).catch((error) => {
        console.log(`Error while logging in ${error}`)
        //create a alert template to display error toast
        switch (error.code) {
            case 'auth/user-not-found':
              console.log('User not found');
              break;
            case 'auth/wrong-password':
              console.log('Wrong password');
              break;
            default:
              console.log('Error while logging in');
          }
    });

    // console.log(data);
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
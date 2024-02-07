"use client"


import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const onboardingSchema = z.object({
    name: z.string(),
    username: z.string(),
    bio: z.string(),
    avatar: z.string(),
});

export default function Onboarding() {
    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
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
                        name="name"
                        render={({ field }) => {
                            return <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="name" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => {
                            return <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => {
                            return <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Input placeholder="bio" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        }}
                    />
                    {/* todo: add uploading avatar logic here */}
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => {
                            return <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input placeholder="avatar" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        }}
                    />
                    <Button type="submit">Next</Button>
                </form>
            </Form>
        </main>
    );
}
"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseClient";
import Link from "next/link";

const signupSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirm: z.string(),
    })
    .refine(
        (data) => {
            return data.password === data.passwordConfirm;
        },
        {
            message: "Passwords do not match",
            path: ["passwordConfirm"],
        }
    );

export default function Signup() {
    const router = useRouter();

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: any) => {
        console.log(data);
        //route to onboarding
        await createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                //create a user in mongodb with uid and email dont save password
                router.push("/auth/onboarding");
            })
            .catch((error) => {
                console.log(`Error while signing up ${error}`);
                //create a alert template to display error toast
                switch (error.code) {
                    case "auth/email-already-in-use":
                        console.log("Email already in use");
                        break;
                    case "auth/invalid-email":
                        console.log("Invalid email");
                        break;
                    default:
                        console.log("Error while signing up");
                }
            });

        // router.push('/auth/onboarding')
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
                <div className="w-full p-6 bg-white rounded-md shadow-md lg:w-[35rem]">
                    <h1 className="text-3xl font-bold text-center text-gray-700">
                        Sign Up
                    </h1>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="max-w-md w-full flex flex-col gap-4 mx-auto"
                        >
                            {" "}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="email"
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="passwordConfirm"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="confirm password"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <Button type="submit" className="mt-5">
                                Sign Up
                            </Button>
                            <div className="relative flex items-center justify-center w-full mt-6 border border-t">
                                <div className="absolute px-5 bg-white">Or</div>
                            </div>
                            <div className="flex mt-4 gap-x-2">
                                <Button
                                    type="button"
                                    className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                        className="w-5 h-5 fill-current"
                                    >
                                        <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                                    </svg>
                                </Button>
                                <Button
                                    type="button"
                                    className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                        className="w-5 h-5 fill-current"
                                    >
                                        <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                                    </svg>
                                </Button>
                            </div>
                            <p className="mt-4 text-sm text-center text-gray-700">
                                Have an account?{" "}
                                <Link
                                    href="/auth/signin"
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>
                    </Form>
                </div>
            </div>
        </main>
    );
}

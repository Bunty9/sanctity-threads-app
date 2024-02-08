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
import { UserValidation } from "@/lib/validations/user";
import { redirect, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/auth.actions";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useUploadThing } from "@/config/useUploadThing";
import { useAuth } from "@/lib/hooks/useAuth";
// import { isBase64Image } from "@/lib/utils";

export default function Onboarding(user: any) {
    const router = useRouter();
    const { startUpload } = useUploadThing("imageUploader");
    const [files, setFiles] = useState<File[]>([]);

    const { pending, isSignedIn, currentuser, auth } = useAuth();

    const form = useForm<z.infer<typeof UserValidation>>({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            email: currentuser?.email ? currentuser.email : "",
            userid: currentuser?.uid ? currentuser.uid : "",
            avatar: user?.avatar ? user.avatar : "",
            name: user?.name ? user.name : "",
            username: user?.username ? user.username : "",
            bio: user?.bio ? user.bio : "",
        },
    });

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: z.infer<typeof UserValidation>) => {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
            data.avatar = imgRes[0].url;
        }

        console.log(data);
        updateUser(data)
            .then(() => {
                router.push("/");
            })
            .catch((error) => {
                console.log(`Error while updating user ${error}`);
            });
    };
    if (pending) {
        return <p>Loading...</p>;
    } else if (!pending && !isSignedIn) {
        redirect("/auth/signin");
    }
    console.log(isSignedIn, currentuser);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
                <div className="w-full p-6 bg-white rounded-md shadow-md lg:w-[35rem]">
                    <h1 className="text-3xl font-bold text-center text-gray-700">
                        Onboarding
                    </h1>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="max-w-md w-full flex flex-col gap-4 mx-auto"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="name"
                                                    type="text"
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
                                name="username"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="username"
                                                    type="text"
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
                                name="bio"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="bio"
                                                    type="text"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            {/* todo: add uploading avatar logic here */}
                            {/* <FormField
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
                    /> */}
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-4">
                                        <FormLabel className="account-form_image-label">
                                            {field.value ? (
                                                <Image
                                                    src={field.value}
                                                    alt="profile_icon"
                                                    width={50}
                                                    height={50}
                                                    priority
                                                    className="rounded-full object-contain"
                                                />
                                            ) : (
                                                <Image
                                                    src="/assets/profile.svg"
                                                    alt="profile_icon"
                                                    width={24}
                                                    height={24}
                                                    className="object-contain"
                                                />
                                            )}
                                        </FormLabel>
                                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                placeholder="Add profile photo"
                                                className="account-form_image-input"
                                                onChange={(e) =>
                                                    handleImage(
                                                        e,
                                                        field.onChange
                                                    )
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="mt-5">
                                Next
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </main>
    );
}

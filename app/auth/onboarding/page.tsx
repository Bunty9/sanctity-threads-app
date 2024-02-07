"use client"


import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserValidation } from "@/lib/validations/user";
import firebaseApp from "@/config/firebaseClient";
import { getAuth } from "firebase/auth";
import { useRouter } from 'next/navigation'
import { updateUser } from "@/lib/actions/auth.actions";
import Image from "next/image";
import {ChangeEvent, useState } from "react";
import { useUploadThing } from "@/config/useUploadThing";
// import { isBase64Image } from "@/lib/utils";


export default function Onboarding(user:any) {
    const router = useRouter()
    const { startUpload } = useUploadThing("imageUploader");
    const [files, setFiles] = useState<File[]>([]);

    const logedInUser = getAuth(firebaseApp).currentUser;
    // console.log(logedInUser);
    if (logedInUser === null) {
        //redirect to login
        router.push('/auth/signin')
    }
    const form = useForm<z.infer<typeof UserValidation>>({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            email: logedInUser?.email ? logedInUser.email : "",
            userid: logedInUser?.uid ? logedInUser.uid : "",
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
        updateUser(data).then(() => {
            router.push('/')
        }).catch((error) => {
            console.log(`Error while updating user ${error}`)
        })
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
          name='avatar'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={50}
                    height={50}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/assets/profile.svg'
                    alt='profile_icon'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
                    <Button type="submit">Next</Button>
                </form>
            </Form>
        </main>
    );
}
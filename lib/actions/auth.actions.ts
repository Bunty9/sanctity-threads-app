"use server";

import { revalidatePath } from "next/cache";

import User from "../models/user.model";

import { connectToDB, disconnectFromDB } from "@/config/mongoose";

//fetch user
export const fetchUser = async (userId: string) => {
    try {
        await connectToDB();
        const user = await User.findById({ id: userId });
        if (!user) {
            return null;
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(`Failed to fetch user: ${error.message}`);
    } finally {
        await disconnectFromDB();
    }
};

//update user

interface Params {
    userId: string;
    username: string;
    email: string;
    name: string;
    bio: string;
    avatar: string;
    path: string;
}

export const updateUser = async (params: Params) => {
    try {
        await connectToDB();
        const user = await User.findByIdAndUpdate(
            { id: params.userId },
            {
                username: params.username.toLowerCase(),
                email: params.email,
                name: params.name,
                bio: params.bio,
                avatar: params.avatar,
                onboarded: true,
            },
            { upsert: true }
        );
        console.log(user);
        if (params.path === "/profile/edit") {
            revalidatePath(params.path);
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(`Failed to create/update user: ${error.message}`);
    } finally {
        await disconnectFromDB();
    }
};

"use server";

import * as z from "zod";
import { UserValidation } from "@/lib/validations/user";
import User from "../models/user.model";

import { connectToDB, disconnectFromDB } from "@/config/mongoose";

//fetch user
export const fetchUser = async (userid: string) => {
    try {
        await connectToDB();
        const user = await User.findById({ userid: userid });
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

export const updateUser = async (params: z.infer<typeof UserValidation>) => {
    try {
        await connectToDB();
        const user = await User.findOneAndUpdate(
            { userid: params.userid },
            {
                username: params.username.toLowerCase(),
                email: params.email,
                name: params.name,
                bio: params.bio,
                avatar: params.avatar,
                onboarded: true,
            },
            { upsert: true, new: true }
        );
        console.log(user);
    } catch (error: any) {
        console.log(error);
        throw new Error(`Failed to create/update user: ${error.message}`);
    } finally {
        await disconnectFromDB();
    }
};

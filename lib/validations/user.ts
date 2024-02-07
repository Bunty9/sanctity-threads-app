import * as z from "zod";

export const UserValidation = z.object({
    userid: z.string(),
    avatar: z.string().url(),
    name: z
        .string()
        .min(3, { message: "Minimum 3 characters." })
        .max(30, { message: "Maximum 30 caracters." }),
    username: z
        .string()
        .min(3, { message: "Minimum 3 characters." })
        .max(30, { message: "Maximum 30 caracters." }),
    email: z.string().email(),
    bio: z
        .string()
        .min(3, { message: "Minimum 3 characters." })
        .max(1000, { message: "Maximum 1000 caracters." }),
});

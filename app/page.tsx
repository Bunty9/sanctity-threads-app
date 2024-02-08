"use client";

import UserCard from "@/components/shared/UserCard";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from "@/config/firebaseClient";

export default function Home() {
    const auth = getAuth(firebaseApp);
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
            // User is signed out
            // Redirect to login page or show a message
        } catch (error) {
            // An error happened during sign out
            // Handle the error here
            console.error("Error signing out: ", error);
        }
    };
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            HOME
            <Button onClick={handleLogout}>Logout</Button>
            <UserCard
                id="1"
                name="John Doe"
                username="johndoe"
                avatar="https://utfs.io/f/28c2c7f6-9388-4ad1-8e5d-e101cde1f182-rlrmfp.jpg"
            />
        </main>
    );
}

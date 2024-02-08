import { useState, useEffect } from "react";
import firebaseApp from "@/config/firebaseClient";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface AuthState {
    isSignedIn: boolean;
    pending: boolean;
    currentuser: User | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isSignedIn: false,
        pending: true,
        currentuser: null,
    });

    const auth = getAuth(firebaseApp);

    useEffect(() => {
        let unregisterAuthObserver: (() => void) | null = null;

        const timerId = setTimeout(() => {
            unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setAuthState({
                        currentuser: user,
                        pending: false,
                        isSignedIn: true,
                    });
                } else {
                    setAuthState({
                        currentuser: null,
                        pending: false,
                        isSignedIn: false,
                    });
                }
            });
        }, 2000);

        return () => {
            clearTimeout(timerId);
            if (unregisterAuthObserver) {
                unregisterAuthObserver();
            }
        };
    }, []);

    return { auth, ...authState };
}

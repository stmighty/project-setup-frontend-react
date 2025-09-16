import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { UserData } from "@/types/user";
import { User, onAuthStateChanged } from "firebase/auth";
import { signOut, auth } from "@/lib/firebase-auth";
import api from "@/lib/axios";
import api2 from "@/lib/axios2";
import { useState, useEffect, useMemo } from "react";

export default function useUser() {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

function useFetchUserData(user: User | null) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      if (!user) {
        setUserData(null);
        setIsLoading(false);
        return;
      }
  
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const { data } = await api.get("/user", {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache"
            }
          });
          setUserData(data.data);
        } catch (err: any) {
          // If user exists but is not found in the DB, create the record.
          if (user && err?.response?.status === 404) {
            try {
              await api.post("/user", {
                id: user.uid,
                email: user.email,
              });
              // Re-fetch the user data after creation.
              const { data } = await api.get("/user", {
                headers: {
                  "Cache-Control": "no-cache",
                  Pragma: "no-cache"
                }
              });
              setUserData(data.data);
            } catch (createError: any) {
              setError(createError);
            }
          } else {
            setError(err);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [user]);
  
    return { userData, isLoading, error, setUserData, setError };
}

// UserProvider component to wrap your app
export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(true);
  
    const { userData, isLoading, error, setUserData, setError } = useFetchUserData(user);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    }, []);
  
    const value = useMemo(
      () => ({
        user,
        userData,
        isLoading: authLoading || isLoading,
        error,
      }),
      [user, userData, authLoading, isLoading, error]
    );
  
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}















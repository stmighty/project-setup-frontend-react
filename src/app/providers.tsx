"use client";
import { UserProvider } from "@/hooks/use-user";
import GoogleAnalytics from "./google-analytic";
import MicrosoftClarity from "./microsoft-clarity";

export function Providers({ children }: { children: React.ReactNode }) {
  return (

      <UserProvider>
        <GoogleAnalytics />
        <MicrosoftClarity />
        {children}
      </UserProvider>
  );
}

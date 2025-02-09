"use client"

import { Button } from "@/components/ui/button";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth"
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const {user} = useAuth();

  return (
    <div className="text-center">
      <h1 className="font-bold text-center mb-5">
        How to add One-time password phone authentication
      </h1>
      {user ? (
        <h2>Welcome to the App as a logged in as User {user?.uid}</h2>
      ) : (
        <h2>You are not logged in</h2>
      )}

      {
        user ? (
          <Button onClick={() => signOut(auth)} className="mt-10">
            Sign Out
          </Button>
        ) : (
          <Link href="/login">
            <Button className="mt-10">
              Sign In
            </Button>
          </Link>
        )
      }
    </div>
  );
}

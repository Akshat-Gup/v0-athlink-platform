"use client"

import { Button } from "@/components/atoms";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

// Landing sign-in component
const LandingSignIn = () => {
  const { user, signOut } = useAuth();
  
  if (user) {
    return (
      <Button 
        variant="ghost" 
        className="rounded-full text-gray-600"
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    );
  }
  
  return (
    <Link href="/login">
      <Button variant="ghost" className="rounded-full text-gray-600">
        Sign In 
      </Button>
    </Link>
  );
};

// Mobile sign-in component
const MobileSignIn = () => {
  const { user, signOut } = useAuth();
  
  if (user) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start text-white bg-red-500 hover:bg-red-600 rounded-full shadow-lg shadow-red-500/25"
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    );
  }
  
  return (
    <Link href="/login">
      <Button
        variant="ghost"
        className="w-full justify-start text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/25 animate-shimmer"
      >
        Sign In
      </Button>
    </Link>
  );
};

// Discover sign-in component
const DiscoverSignIn = () => {
  const { user, signOut } = useAuth();
  
  if (user) {
    return (
      <Button
        variant="ghost"
        className="text-sm font-medium px-4 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-lg shadow-red-500/25"
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    );
  }
  
  return (
    <Link href="/login">
      <Button
        variant="ghost"
        className="text-sm font-medium px-4 text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/25 animate-shimmer"
      >
        Sign In
      </Button>
    </Link>
  );
};

export { LandingSignIn, MobileSignIn, DiscoverSignIn };
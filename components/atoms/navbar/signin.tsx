import { Button } from "@/components/atoms";
import { auth, signOut, signIn } from "@/auth";

// Landing sign-in component
const LandingSignIn = () => (
    <Button variant="ghost" className="rounded-full text-gray-600">
      Sign In 
    </Button>
);

// Mobile sign-in component
const MobileSignIn = () => (
  <Button
    variant="ghost"
    className="w-full justify-start text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/25 animate-shimmer"
  >
    Sign In
  </Button>
);

// Discover sign-in component
const DiscoverSignIn = () => (
  <Button
    variant="ghost"
    className="text-sm font-medium px-4 text-white bg-green-500 hover:bg-green-600 rounded-full shadow-lg shadow-green-500/25 animate-shimmer"
  >
    Sign In
  </Button>
);

export { LandingSignIn, MobileSignIn, DiscoverSignIn };
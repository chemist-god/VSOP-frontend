import type { Metadata } from "next";
import { FirstLoginExperience } from "@/components/vsop/onboarding/first-login-experience";

export const metadata: Metadata = {
  title: "Welcome to VSOP",
};

export default function OnboardingPage() {
  return <FirstLoginExperience />;
}

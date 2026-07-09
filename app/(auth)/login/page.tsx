import type { Metadata } from "next";
import { LoginForm } from "@/components/vsop/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in — VeriTrack VSOP",
  description: "Sign in to the VeriTrack internal support operations dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { acceptInvite, previewInvite } from "@/lib/api/team";
import { setAuthSession } from "@/lib/auth";
import { needsOnboarding } from "@/lib/onboarding/needs-onboarding";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { PasswordInput } from "@/components/vsop/auth/password-input";
import { VsopLogo } from "@/components/templates/triggerly/sections/logo";
import { ThemeToggle } from "@/components/vsop/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const previewQuery = useQuery({
    queryKey: ["invite-preview", token],
    queryFn: () => previewInvite(token),
    enabled: Boolean(token),
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptInvite({ token, password }),
    onSuccess: (result) => {
      setAuthSession(result.accessToken, result.refreshToken, result.user);
      toastSuccess("Welcome aboard", {
        description: "Your account is ready.",
      });
      router.replace(
        needsOnboarding(result.user) ? "/onboarding" : "/dashboard",
      );
    },
    onError: (error) => {
      toastError(
        "Could not accept invite",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  if (!token) {
    return (
      <Card className="border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle>Invalid invitation</CardTitle>
          <CardDescription>
            This link is missing a token. Ask your admin to resend the invite.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (previewQuery.isLoading) {
    return <Skeleton className="h-80 w-full rounded-2xl" />;
  }

  if (previewQuery.isError || !previewQuery.data) {
    return (
      <Card className="border-border/60 bg-card/85">
        <CardHeader>
          <CardTitle>Invitation unavailable</CardTitle>
          <CardDescription>
            It may have expired or already been used. Ask an admin to send a new
            invite.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const invite = previewQuery.data;

  return (
    <Card className="border-border/60 bg-card/85 shadow-xl shadow-indigo-500/5">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={invite.name}
            email={invite.email}
            role={invite.role}
            size={56}
          />
          <div>
            <CardTitle className="text-2xl">Accept your invite</CardTitle>
            <CardDescription>
              Create your password to join VeriTrack VSOP.
            </CardDescription>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          <ShieldCheck className="size-3" />
          {invite.role}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={invite.name} disabled />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={invite.email} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Create password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            autoComplete="new-password"
          />
        </div>
        <Button
          className="w-full"
          disabled={
            acceptMutation.isPending ||
            password.length < 8 ||
            password !== confirm
          }
          onClick={() => acceptMutation.mutate()}
        >
          {acceptMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account & continue"
          )}
        </Button>
        {password && password !== confirm ? (
          <p className="text-xs text-amber-300">Passwords do not match.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="hero-glow opacity-50" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="min-w-0" aria-label="VSOP">
            <VsopLogo size="lg" className="max-w-[9rem] sm:max-w-[11rem]" />
          </div>
          <ThemeToggle className="size-8 rounded-lg" />
        </div>
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </div>
  );
}

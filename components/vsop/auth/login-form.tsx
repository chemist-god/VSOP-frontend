"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { login } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { toastError, toastSuccess } from "@/lib/toast";
import { PasswordInput } from "@/components/vsop/auth/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toastSuccess("Welcome back", {
        description: `Signed in as ${data.user.name}`,
      });
      router.replace("/dashboard");
    },
  });

  useEffect(() => {
    if (!mutation.error) return;

    const message =
      mutation.error instanceof ApiError
        ? mutation.error.message
        : "Something went wrong. Please try again.";

    toastError("Sign in failed", {
      description: message,
    });
  }, [mutation.error]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <Card className="w-full max-w-[420px] border-border/60 bg-card/85 shadow-2xl shadow-indigo-500/5 backdrop-blur-md sm:max-w-md">
      <CardHeader className="space-y-1.5 px-5 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Sign in to VSOP</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Internal access for VeriTrack support operations.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-6 sm:px-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <FieldGroup className="gap-4 sm:gap-5">
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@veritrack.cloud"
                className="h-10 sm:h-9"
                aria-invalid={!!form.formState.errors.email}
                {...form.register("email")}
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-10 sm:h-9"
                aria-invalid={!!form.formState.errors.password}
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="h-10 w-full sm:h-9"
            size="lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Invite-only access.{" "}
          <Link
            href="/"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

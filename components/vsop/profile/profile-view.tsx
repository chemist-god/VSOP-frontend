"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import {
  changeMyPassword,
  fetchMyProfile,
  updateMyProfile,
} from "@/lib/api/team";
import { getStoredUser, setAuthSession, getAccessToken, getRefreshToken } from "@/lib/auth";
import { queryKeys } from "@/lib/query-keys";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { PasswordInput } from "@/components/vsop/auth/password-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileView() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: fetchMyProfile,
  });

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profileQuery.data?.name) setName(profileQuery.data.name);
  }, [profileQuery.data?.name]);

  const updateMutation = useMutation({
    mutationFn: () => updateMyProfile(name.trim()),
    onSuccess: (user) => {
      const access = getAccessToken();
      const refresh = getRefreshToken();
      if (access && refresh) {
        setAuthSession(access, refresh, user);
      }
      toastSuccess("Profile updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
    },
    onError: (error) => {
      toastError(
        "Could not update profile",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  const passwordMutation = useMutation({
    mutationFn: () =>
      changeMyPassword({
        currentPassword,
        newPassword,
      }),
    onSuccess: () => {
      toastSuccess("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toastError(
        "Could not change password",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  const user = profileQuery.data ?? getStoredUser();

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Profile"
        description="Manage your account details and password."
      />

      {profileQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      ) : null}

      {user ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <UserAvatar
                  name={user.name}
                  email={user.email}
                  role={user.role}
                  size={64}
                />
                <div>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    <Shield className="size-3" />
                    {user.role}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Display name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>
              <Button
                disabled={
                  updateMutation.isPending ||
                  !name.trim() ||
                  name.trim() === user.name
                }
                onClick={() => updateMutation.mutate()}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Choose a strong password only you know. Admins never set or see
                it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <PasswordInput
                  id="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <Button
                disabled={
                  passwordMutation.isPending ||
                  !currentPassword ||
                  newPassword.length < 8 ||
                  newPassword !== confirmPassword
                }
                onClick={() => passwordMutation.mutate()}
              >
                {passwordMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
              {newPassword && newPassword !== confirmPassword ? (
                <p className="text-xs text-amber-300">Passwords do not match.</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

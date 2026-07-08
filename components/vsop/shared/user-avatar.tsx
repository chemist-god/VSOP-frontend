"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dicebearAvatarUrl, roleAvatarBackground } from "@/lib/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  role?: string;
  className?: string;
  size?: number;
};

function initials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return email?.slice(0, 2).toUpperCase() ?? "VT";
}

export function UserAvatar({
  name,
  email,
  role,
  className,
  size = 32,
}: UserAvatarProps) {
  const seed = email || name || "vsop";
  const src = dicebearAvatarUrl(seed, {
    size: size * 2,
    background: roleAvatarBackground(role),
  });

  return (
    <Avatar className={cn("shrink-0", className)} style={{ width: size, height: size }}>
      <AvatarImage src={src} alt={name ?? email ?? "User"} />
      <AvatarFallback className="text-[10px]">
        {initials(name, email)}
      </AvatarFallback>
    </Avatar>
  );
}

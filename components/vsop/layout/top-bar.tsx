"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { clearAuthSession, getStoredUser } from "@/lib/auth";
import { toastSuccess } from "@/lib/toast";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const router = useRouter();
  const user = getStoredUser();

  function handleLogout() {
    clearAuthSession();
    toastSuccess("Signed out", {
      description: "See you next time.",
    });
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {onOpenMobileNav ? (
          <Button
            variant="outline"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={onOpenMobileNav}
          >
            <Menu className="size-4" />
          </Button>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            Internal dashboard
          </p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            VeriTrack support operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 max-w-[240px] justify-start gap-2 px-2 sm:px-3"
            >
              <UserAvatar
                name={user?.name}
                email={user?.email}
                role={user?.role}
                size={24}
              />
              <span className="hidden truncate text-left sm:block">
                <span className="block text-xs font-medium">
                  {user?.name ?? "Team member"}
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  {user?.role ?? "VSOP"}
                </span>
              </span>
              <ChevronDown className="ml-auto size-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{user?.name ?? "Signed in"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <UserRound />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

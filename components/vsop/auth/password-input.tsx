"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type"
> & {
  containerClassName?: string;
};

export function PasswordInput({
  className,
  containerClassName,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
    </div>
  );
}

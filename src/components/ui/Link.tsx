import NextLink from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";
import { LinkProps } from "next/dist/client/link";
import { cn } from "@/lib/utils";

export const Link = ({
  children,
  className,
  ...props
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) => {
  return (
    <NextLink
      {...props}
      className={cn("text-muted-foreground underline hover:text-foreground", className)}
    >
      {children}
    </NextLink>
  );
};

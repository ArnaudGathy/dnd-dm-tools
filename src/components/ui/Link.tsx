import NextLink from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";
import { LinkProps } from "next/dist/client/link";

export const Link = ({
  children,
  ...props
}: LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) => {
  return (
    <NextLink
      {...props}
      className="text-muted-foreground underline hover:text-foreground"
    >
      {children}
    </NextLink>
  );
};

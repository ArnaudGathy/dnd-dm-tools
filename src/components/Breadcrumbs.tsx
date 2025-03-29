"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isArray } from "remeda";

type Crumb = {
  name: ReactNode;
  path: string;
};

type CrumbsInput = (Crumb | Crumb[])[];

export default function Breadcrumbs({
  crumbs,
}: Readonly<{
  crumbs: CrumbsInput;
}>) {
  const pathName = usePathname();
  let cumulativePath = "";

  const getCurrentPathCrumbs = crumbs.reduce((acc: Crumb[], next) => {
    if (isArray(next)) {
      const currentCrumb = next.find(({ path }) => pathName.includes(path));
      if (currentCrumb) {
        return [...acc, currentCrumb];
      }
      return acc;
    }
    return [...acc, next];
  }, []);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {getCurrentPathCrumbs.map((crumb) => {
          if (!pathName.includes(crumb.path)) {
            return null;
          }

          cumulativePath += `${crumb.path}`;
          const isLast = cumulativePath === pathName;

          return (
            <Fragment key={crumb.path || "/"}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={cumulativePath || "/"}>{crumb.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

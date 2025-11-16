import { ReactNode } from "react";

export default function TableTitle({ children }: { children: ReactNode }) {
  return <h5 className="text-base font-bold">{children}</h5>;
}

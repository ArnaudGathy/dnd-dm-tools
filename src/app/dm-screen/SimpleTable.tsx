import { ReactNode } from "react";
import "./styles.css";

export default function SimpleTable({
  columns,
  heading,
  children,
}: {
  columns?: string[];
  heading?: ReactNode;
  children: ReactNode;
}) {
  return (
    <table>
      {!heading && columns && (
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
      )}
      {heading && !columns && heading}
      <tbody>{children}</tbody>
    </table>
  );
}

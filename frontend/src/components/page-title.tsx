import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description: ReactNode;
}
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <h2 className="text-description text-base font-normal">{description}</h2>
    </div>
  );
}

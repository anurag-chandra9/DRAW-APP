import * as React from "react";
import Link from "next/link";

interface CardProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CustomCard({
  icon,
  title,
  description,
  href,
  className = "",
  children
}: CardProps): JSX.Element {
  const Wrapper: any = href ? Link : "div";

  return (
    <Wrapper
      href={
        href
          ? `${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`
          : undefined
      }
      className={`flex flex-col items-start rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary transition-all ${className}`}
    >
      {icon && (
        <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4">
          {icon}
        </div>
      )}

      {title && (
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          {title}
          <span className="text-primary">-&gt;</span>
        </h2>
      )}

      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}

      {children}
    </Wrapper>
  );
}

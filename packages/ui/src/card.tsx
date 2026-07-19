import type { JSX, ReactNode } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: ReactNode;
  href: string;
}): JSX.Element {
  const trackingParams = [
    "utm_source=create-turbo",
    "utm_medium=basic",
    "utm_campaign=create-turbo",
  ].join("&");
  const trackingHref = `${href}?${trackingParams}"`;

  return (
    <a
      className={className}
      href={trackingHref}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2>
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}

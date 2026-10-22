import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * MobileLayout provides a responsive page and section layout container
 * with standardized horizontal padding (16px on small mobile, 20-24px on larger screens),
 * boundary constraints (overflow-x: clip), and zero horizontal scroll.
 */
export default function MobileLayout({
  children,
  className = "",
  id,
}: MobileLayoutProps) {
  return (
    <div
      id={id}
      className={`w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

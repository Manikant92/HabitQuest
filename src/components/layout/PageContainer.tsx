
import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("container py-6 md:py-8", className)}>
      {children}
    </div>
  );
};

export default PageContainer;

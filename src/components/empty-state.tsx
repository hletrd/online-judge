import type { ElementType } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <Icon className="size-10 text-muted-foreground" />
      <div className="text-center space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Link href={action.href}>
          <Button variant="outline" size="sm">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}

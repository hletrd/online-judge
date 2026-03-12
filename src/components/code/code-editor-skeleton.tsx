import { Skeleton } from "@/components/ui/skeleton";

type CodeEditorSkeletonProps = {
  minHeight?: number;
};

export function CodeEditorSkeleton({ minHeight = 300 }: CodeEditorSkeletonProps) {
  return <Skeleton className="w-full rounded-xl" style={{ height: minHeight + 16 }} />;
}

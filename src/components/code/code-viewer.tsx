import dynamic from "next/dynamic";
import { CodeEditorSkeleton } from "./code-editor-skeleton";

const CodeSurface = dynamic(
  () => import("./code-surface").then((m) => ({ default: m.CodeSurface })),
  { ssr: false, loading: () => <CodeEditorSkeleton minHeight={180} /> }
);

type CodeViewerProps = {
  ariaLabel?: string;
  ariaLabelledby?: string;
  className?: string;
  id?: string;
  language?: string | null;
  minHeight?: number;
  tone?: "default" | "danger";
  value: string;
};

export function CodeViewer(props: CodeViewerProps) {
  return <CodeSurface {...props} minHeight={props.minHeight ?? 180} readOnly />;
}

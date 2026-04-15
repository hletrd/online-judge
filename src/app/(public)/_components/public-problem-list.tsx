import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PublicProblemListItem = {
  id: string;
  sequenceNumber: number | null;
  title: string;
  difficultyLabel: string | null;
  tags: Array<{ name: string; color: string | null }>;
};

type PublicProblemListProps = {
  title: string;
  description: string;
  noProblemsLabel: string;
  numberLabel: string;
  problemTitleLabel: string;
  difficultyLabel: string;
  tagLabel: string;
  problems: PublicProblemListItem[];
};

export function PublicProblemList({
  title,
  description,
  noProblemsLabel,
  numberLabel,
  problemTitleLabel,
  difficultyLabel,
  tagLabel,
  problems,
}: PublicProblemListProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {problems.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">{noProblemsLabel}</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">{numberLabel}</TableHead>
                  <TableHead>{problemTitleLabel}</TableHead>
                  <TableHead className="w-28 text-center">{difficultyLabel}</TableHead>
                  <TableHead className="w-48">{tagLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((problem, index) => (
                  <TableRow key={problem.id}>
                    <TableCell className="text-center font-mono text-sm text-muted-foreground">
                      {problem.sequenceNumber ?? index + 1}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/practice/problems/${problem.id}`}
                        className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {problem.difficultyLabel ?? "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <Badge key={tag.name} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

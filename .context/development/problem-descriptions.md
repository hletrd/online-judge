# Problem Descriptions (MANDATORY)

All problem descriptions **MUST** be written in **Markdown** (not HTML). This is a strict rule for all problems created via the admin UI, API, or seed scripts.

## Required Format

Every problem description must include:

1. **Problem statement** — clear description of what to solve
2. **Input format** — what the input looks like (one line, multiple lines, etc.)
3. **Output format** — what the expected output looks like
4. **Constraints** — input size limits, value ranges
5. **Examples** — at least one input/output example with explanation

## Template

```markdown
### 문제

[Problem description here]

### 입력

[Input format description]

### 출력

[Output format description]

### 제한

- [Constraint 1]
- [Constraint 2]

### 입출력 예시

**입력 1**
```
[sample input]
```

**출력 1**
```
[sample output]
```

**설명**: [Brief explanation of why this is the correct output]
```

## Rules

- **Never use HTML tags** (`<h3>`, `<p>`, `<code>`, etc.) — always use Markdown equivalents (`###`, backticks, etc.)
- **Always include at least one visible example** with both input and output
- **Use fenced code blocks** (triple backticks) for input/output examples, not inline code
- **Support both Korean and English** — Korean is the default language for problem descriptions

# Implementation Plan: New Languages for JudgeKit

> Status: DRAFT — Not yet implemented
> Created: 2026-03-21
> Total languages researched: 55
> Languages to add: 18 (6 EASY + 12 MODERATE)

## Priority 1: EASY (add first)

### 1.1 MicroPython

- **Language key**: `micropython`
- **Display name**: MicroPython
- **Extension**: `.py`
- **Docker image**: `judge-micropython`
- **Base**: `alpine:edge`
- **Install**: `apk add --no-cache micropython`
- **Compile command**: none
- **Run command**: `["micropython", "/workspace/solution.py"]`
- **Version**: 1.27.0
- **Image size**: ~15 MB (smallest in JudgeKit)
- **A+B solution**:
  ```python
  a, b = map(int, input().split())
  print(a + b)
  ```

**Dockerfile**:
```dockerfile
FROM alpine:edge
RUN apk add --no-cache micropython && \
    adduser -D -s /bin/false judge && \
    mkdir -p /workspace && chown judge:judge /workspace
WORKDIR /workspace
USER judge
```

---

### 1.2 Janet

- **Language key**: `janet`
- **Display name**: Janet
- **Extension**: `.janet`
- **Docker image**: `judge-janet`
- **Base**: `alpine:3.21`
- **Install**: build from source (~1MB binary), multi-stage
- **Compile command**: none
- **Run command**: `["janet", "/workspace/solution.janet"]`
- **Version**: 1.41.2
- **Image size**: ~50 MB
- **A+B solution**:
  ```janet
  (def line (string/trim (file/read stdin :line)))
  (def parts (string/split " " line))
  (def a (scan-number (get parts 0)))
  (def b (scan-number (get parts 1)))
  (print (+ a b))
  ```

**Dockerfile**:
```dockerfile
FROM alpine:3.21 AS builder
RUN apk add --no-cache build-base git && \
    git clone --depth 1 --branch v1.41.2 https://github.com/janet-lang/janet.git /tmp/janet && \
    cd /tmp/janet && make -j$(nproc) && make install DESTDIR=/install PREFIX=/usr

FROM alpine:3.21
COPY --from=builder /install/usr/bin/janet /usr/bin/janet
COPY --from=builder /install/usr/lib/libjanet.* /usr/lib/
RUN adduser -D -s /bin/false judge && \
    mkdir -p /workspace && chown judge:judge /workspace
WORKDIR /workspace
USER judge
```

---

### 1.3 C3

- **Language key**: `c3`
- **Display name**: C3
- **Extension**: `.c3`
- **Docker image**: `judge-c3`
- **Base**: `debian:bookworm-slim`
- **Install**: download prebuilt binary from GitHub releases
- **Compile command**: `["c3c", "compile", "-o", "/workspace/solution", "/workspace/solution.c3"]`
- **Run command**: `["/workspace/solution"]`
- **Version**: 0.7.10
- **Image size**: ~200 MB
- **A+B solution**:
  ```c3
  module solution;
  import std::io;

  fn int main() {
      int a = io::treadline()!!.to_int()!!;
      int b = io::treadline()!!.to_int()!!;
      io::printfn("%d", a + b);
      return 0;
  }
  ```

**Dockerfile**:
```dockerfile
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates gcc libc-dev && \
    curl -L -o /tmp/c3c.tar.gz https://github.com/c3lang/c3c/releases/download/v0.7.10/c3-linux.tar.gz && \
    tar -xzf /tmp/c3c.tar.gz -C /usr/local && \
    rm /tmp/c3c.tar.gz && \
    apt-get purge -y curl && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*
ENV C3C_LIB=/usr/local/c3/lib
ENV PATH="/usr/local/c3/bin:$PATH"
RUN useradd -m -s /bin/false judge && \
    mkdir -p /workspace && chown judge:judge /workspace
WORKDIR /workspace
USER judge
```

---

### 1.4 Hy

- **Language key**: `hy`
- **Display name**: Hy
- **Extension**: `.hy`
- **Docker image**: `judge-hy`
- **Base**: `python:3.14-alpine` (or official `hylang:slim`)
- **Install**: `pip install hy` (or use official `hylang` Docker image)
- **Compile command**: none
- **Run command**: `["hy", "/workspace/solution.hy"]`
- **Version**: 1.2.0
- **Image size**: ~150 MB
- **A+B solution**:
  ```hy
  (setv a (int (input)))
  (setv b (int (input)))
  (print (+ a b))
  ```

**Dockerfile**:
```dockerfile
FROM python:3.14-alpine
RUN pip install --no-cache-dir hy && \
    adduser -D -s /bin/false judge && \
    mkdir -p /workspace && chown judge:judge /workspace
WORKDIR /workspace
USER judge
```

---

### 1.5 Arturo

- **Language key**: `arturo`
- **Display name**: Arturo
- **Extension**: `.art`
- **Docker image**: `judge-arturo`
- **Base**: official `arturolang/arturo`
- **Install**: pre-built in official image
- **Compile command**: none
- **Run command**: `["arturo", "/workspace/solution.art"]`
- **Version**: 0.10.0
- **Image size**: ~200 MB
- **A+B solution**:
  ```arturo
  a: to :integer input ""
  b: to :integer input ""
  print a + b
  ```

**Dockerfile**:
```dockerfile
FROM arturolang/arturo:latest
USER root
RUN adduser -D -s /bin/false judge && \
    mkdir -p /workspace && chown judge:judge /workspace
WORKDIR /workspace
USER judge
```

---

### 1.6 Rexx (Regina)

- **Language key**: `rexx`
- **Display name**: Rexx
- **Extension**: `.rexx`
- **Docker image**: `judge-rexx`
- **Base**: `debian:bookworm-slim`
- **Install**: `apt-get install -y regina-rexx`
- **Compile command**: none
- **Run command**: `["regina", "/workspace/solution.rexx"]`
- **Version**: 3.9.5 (Debian), 3.9.7 (upstream)
- **Image size**: ~100 MB
- **A+B solution**:
  ```rexx
  /* solution.rexx */
  parse pull a b
  say a + b
  ```

**Dockerfile**:
```dockerfile
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends regina-rexx && \
    rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /bin/false judge && \
    mkdir -p /workspace && chown judge:judge /workspace
WORKDIR /workspace
USER judge
```

---

## Priority 2: MODERATE (add second)

### 2.1 AssemblyScript

- **Language key**: `assemblyscript`
- **Display name**: AssemblyScript
- **Extension**: `.ts`
- **Docker image**: `judge-assemblyscript`
- **Base**: `node:22-alpine`
- **Install**: `npm install -g assemblyscript as-wasi @assemblyscript/wasi-shim` + wasmtime binary
- **Compile command**: `["sh", "-c", "asc /workspace/solution.ts --config /usr/local/lib/node_modules/@assemblyscript/wasi-shim/asconfig.json -o /workspace/solution.wasm -O2"]`
- **Run command**: `["wasmtime", "/workspace/solution.wasm"]`
- **Version**: latest (npm)
- **Image size**: ~280 MB
- **A+B solution**:
  ```typescript
  import "wasi";
  import { Console } from "as-wasi/assembly";

  export function _start(): void {
    const line = Console.readLine();
    if (line == null) return;
    const parts = line!.trim().split(" ");
    const a = i32.parse(parts[0]);
    const b = i32.parse(parts[1]);
    Console.log((a + b).toString());
  }
  ```
- **Note**: Compiler startup is 1-3s. Set generous compile time limit (15s).

---

### 2.2 IDL/GDL

- **Language key**: `gdl`
- **Display name**: GDL (IDL)
- **Extension**: `.pro`
- **Docker image**: `judge-gdl`
- **Base**: `debian:trixie-slim`
- **Install**: `apt-get install -y gnudatalanguage`
- **Compile command**: none
- **Run command**: `["sh", "-c", "gdl -q --silent -e \"@'/workspace/solution.pro'\""]`
- **Version**: 1.1.3
- **Image size**: ~400 MB (wxWidgets dependency)
- **A+B solution**:
  ```idl
  a = 0L
  b = 0L
  READ, a, b
  PRINT, a + b
  exit
  ```
- **Note**: Must use `-e "@'file'"` invocation to prevent stdin conflict with script source.

---

### 2.3 Koka

- **Language key**: `koka`
- **Display name**: Koka
- **Extension**: `.kk`
- **Docker image**: `judge-koka`
- **Base**: `ubuntu:22.04`
- **Install**: `curl -sSL https://github.com/koka-lang/koka/releases/download/v3.2.3/install.sh | sh`
- **Compile command**: `["koka", "-O2", "-o", "/workspace/solution", "/workspace/solution.kk"]`
- **Run command**: `["/workspace/solution"]`
- **Version**: 3.2.3
- **Image size**: ~500 MB
- **A+B solution**:
  ```koka
  import std/os/readline
  import std/text/parse

  fun main()
    val a = readline().trim.parse-int.default(0)
    val b = readline().trim.parse-int.default(0)
    println( (a + b).show )
  ```

---

### 2.4 Nelua

- **Language key**: `nelua`
- **Display name**: Nelua
- **Extension**: `.nelua`
- **Docker image**: `judge-nelua`
- **Base**: `debian:bookworm-slim`
- **Install**: build from pinned git commit
- **Compile command**: `["nelua", "-o", "/workspace/solution", "/workspace/solution.nelua"]`
- **Run command**: `["/workspace/solution"]`
- **Version**: git (pinned commit)
- **Image size**: ~300 MB
- **A+B solution**:
  ```nelua
  local function scanf(fmt: cstring, ...: cvarargs): cint <cimport, nodecl> end
  local a: cint, b: cint
  scanf('%d %d', &a, &b)
  print(a + b)
  ```

---

### 2.5 Hare

- **Language key**: `hare`
- **Display name**: Hare
- **Extension**: `.ha`
- **Docker image**: `judge-hare`
- **Base**: `debian:bookworm-slim`
- **Install**: build qbe + harec + hare from source (pinned v0.26.0)
- **Compile command**: `["hare", "build", "-o", "/workspace/solution", "/workspace/solution.ha"]`
- **Run command**: `["/workspace/solution"]`
- **Version**: 0.26.0
- **Image size**: ~300 MB
- **A+B solution**:
  ```hare
  use fmt;
  use os;
  use bufio;
  use strconv;
  use strings;

  export fn main() void = {
      const line = bufio::read_line(os::stdin)! as []u8;
      defer free(line);
      const s = strings::fromutf8(line)!;
      const tok = strings::tokenize(s, " ");
      const a = strconv::stoi(strings::next_token(&tok) as str)!;
      const b = strconv::stoi(strings::next_token(&tok) as str)!;
      fmt::printfln("{}", a + b)!;
  };
  ```

---

### 2.6 Picat

- **Language key**: `picat`
- **Display name**: Picat
- **Extension**: `.pi`
- **Docker image**: `judge-picat`
- **Base**: `ubuntu:22.04`
- **Install**: download binary tarball from picat-lang.org (~10MB)
- **Compile command**: none
- **Run command**: `["picat", "/workspace/solution.pi"]`
- **Version**: 3.9#7
- **Image size**: ~200 MB
- **A+B solution**:
  ```picat
  main =>
      A = read_int(),
      B = read_int(),
      writeln(A + B).
  ```
- **Note**: Explicitly designed for competitive programming. Built-in `read_int()`.

---

### 2.7 Lean 4

- **Language key**: `lean`
- **Display name**: Lean 4
- **Extension**: `.lean`
- **Docker image**: `judge-lean`
- **Base**: `ubuntu:24.04`
- **Install**: download release tarball from GitHub
- **Compile command**: none (interpreted via `lean --run`)
- **Run command**: `["lean", "--run", "/workspace/solution.lean"]`
- **Version**: 4.27.0
- **Image size**: ~1.0 GB (bundles internal C compiler)
- **A+B solution**:
  ```lean
  def main : IO Unit := do
    let stdin ← IO.getStdin
    let line1 ← stdin.getLine
    let line2 ← stdin.getLine
    let a := line1.trim.toInt!
    let b := line2.trim.toInt!
    IO.println s!"{a + b}"
  ```

---

### 2.8 Vala

- **Language key**: `vala`
- **Display name**: Vala
- **Extension**: `.vala`
- **Docker image**: `judge-vala`
- **Base**: `debian:bookworm-slim`
- **Install**: `apt-get install -y valac libglib2.0-dev build-essential`
- **Compile command**: `["valac", "-o", "/workspace/solution", "/workspace/solution.vala"]`
- **Run command**: `["/workspace/solution"]`
- **Version**: 0.56.17
- **Image size**: ~350 MB
- **A+B solution**:
  ```vala
  void main() {
      int a, b;
      stdin.scanf("%d", out a);
      stdin.scanf("%d", out b);
      stdout.printf("%d\n", a + b);
  }
  ```

**Dockerfile**:
```dockerfile
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    valac libglib2.0-dev build-essential && \
    rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /bin/false judge && \
    mkdir -p /workspace && chown judge:judge /workspace
WORKDIR /workspace
USER judge
```

---

### 2.9 Pike

- **Language key**: `pike`
- **Display name**: Pike
- **Extension**: `.pike`
- **Docker image**: `judge-pike`
- **Base**: official `pikelang/pike:stable-latest-slim` (Alpine)
- **Install**: pre-built in official image
- **Compile command**: none
- **Run command**: `["pike", "/workspace/solution.pike"]`
- **Version**: 8.0.1956
- **Image size**: ~150 MB (slim Alpine variant)
- **A+B solution**:
  ```pike
  int main() {
      int a = (int)Stdio.stdin->gets();
      int b = (int)Stdio.stdin->gets();
      write("%d\n", a + b);
      return 0;
  }
  ```

---

### 2.10 Fantom

- **Language key**: `fantom`
- **Display name**: Fantom
- **Extension**: `.fan`
- **Docker image**: `judge-fantom`
- **Base**: `eclipse-temurin:21-jre-alpine`
- **Install**: download release zip from GitHub
- **Compile command**: none (script mode)
- **Run command**: `["fan", "/workspace/solution.fan"]`
- **Version**: 1.0.79
- **Image size**: ~210 MB
- **A+B solution**:
  ```fantom
  class Solution {
    static Void main() {
      line := Env.cur.in.readLine
      parts := line.split(' ')
      a := parts[0].toInt
      b := parts[1].toInt
      echo(a + b)
    }
  }
  ```
- **Note**: JVM startup adds ~300-800ms per submission. Set generous time limits.

---

### 2.11 Nushell

- **Language key**: `nushell`
- **Display name**: Nushell
- **Extension**: `.nu`
- **Docker image**: `judge-nushell`
- **Base**: official `ghcr.io/nushell/nushell:0.111.0-debian`
- **Install**: pre-built in official image
- **Compile command**: none
- **Run command**: `["nu", "--stdin", "/workspace/solution.nu"]`
- **Version**: 0.111.0
- **Image size**: ~200 MB
- **A+B solution**:
  ```nushell
  let parts = ($in | str trim | split row ' ')
  let a = ($parts | get 0 | into int)
  let b = ($parts | get 1 | into int)
  print ($a + $b)
  ```
- **Note**: `--stdin` flag is required for piped stdin. Pre-1.0, pin version carefully.

---

### 2.12 Squirrel

- **Language key**: `squirrel`
- **Display name**: Squirrel
- **Extension**: `.nut`
- **Docker image**: `judge-squirrel`
- **Base**: `debian:bookworm-slim`
- **Install**: `apt-get install -y squirrel3`
- **Compile command**: none
- **Run command**: `["sq", "/workspace/solution.nut"]`
- **Version**: 3.1 (Debian), 3.2 (upstream)
- **Image size**: ~90 MB
- **A+B solution**:
  ```squirrel
  local stdin = file("stdin", "r")
  local line = stdin.readline()
  local parts = split(line.strip(), " ")
  local a = parts[0].tointeger()
  local b = parts[1].tointeger()
  print(a + b + "\n")
  ```

---

## Deferred (revisit later)

| Language | Version | Why Deferred |
|----------|---------|-------------|
| MoonBit | v0.8.3 | Wait for v1.0; needs project scaffold per submission |
| Idris 2 | v0.8.0 | No v0.8.0 Docker image; complex build; low demand |
| Factor | v0.101 | Niche stack-based paradigm; needs Codewars Dockerfile update |
| Civet | v0.10.x | Pre-1.0; redundant with TypeScript/CoffeeScript |
| Clean | v3.1 | Uniqueness type I/O verbose; two-file modules; niche |
| Neko | v2.3.0 | Stagnant (2019); no built-in readline; niche |

## Not Adding (55 languages researched, rejected)

| Language | Rating | Reason |
|----------|--------|--------|
| Mojo | HARD | Closed-source compiler, 3-5 GB image |
| PureScript | HARD | Needs pre-baked package ecosystem |
| Pony | HARD | Async-only stdin (20+ lines boilerplate) |
| Beef | HARD | No Linux binaries, 2-5 GB image |
| Inko | HARD | Pre-1.0, 1+ GB image |
| Vale | HARD | Dormant since May 2024 |
| Wren | HARD | Abandoned since 2021 |
| Grain | HARD | No readline, 10s first-compile |
| Unison | HARD | Content-addressed codebase model |
| Mercury | HARD | 1+ GB image, slow compile, zero CP use |
| Io | HARD | Stagnant, no official Docker image |
| Ring | HARD | No pre-built binary, 1+ GB image |
| Agda | HARD | 3-5 GB image (GHC), 10-60s compile |
| Lobster | MODERATE | Game-focused, CMake build — low demand |
| Ballerina | MODERATE | JVM, 670 MB — low demand |
| Carbon | NOT_FEASIBLE | No stable release, no ReadInt |
| Roc | NOT_FEASIBLE | Network fetch at compile time |
| Wing | NOT_FEASIBLE | Company shut down April 2025 |
| Bend | NOT_FEASIBLE | No stdin reading, 24-bit int limit |
| Jakt | NOT_FEASIBLE | No stdin API in stdlib |
| Austral | NOT_FEASIBLE | Mandatory dual-file modules, no stdin API |
| Emojicode | NOT_FEASIBLE | Abandoned since 2020, requires LLVM 7 |
| Chapel | HARD | 3-6 GB image |
| Eiffel | HARD | 2-4 GB image, mandatory .ecf project file |
| Elm | HARD | Requires JS wrapper scaffold for stdin |
| Red | HARD | 32-bit only on Linux, alpha stability |
| Maxima | HARD | stdin/script stream conflict |
| Pari/GP | HARD | stdin/script stream conflict |
| MUMPS/YottaDB | HARD | Requires env setup + writable DB dir per submission |
| Curry (KiCS2) | HARD | 2-3 GB GHC-based image |
| Futhark | NOT_FEASIBLE | Output is type-annotated (`8i64`), no string I/O |
| Dafny | NOT_FEASIBLE | No native stdin API, requires extern C# shim |

---

## Implementation Order

### Phase 1: EASY (6 languages)
1. **MicroPython** — `apk add`, ~15 MB
2. **Squirrel** — `apt install`, ~90 MB
3. **Rexx** — `apt install`, ~100 MB
4. **Hy** — `pip install`, ~150 MB, reuses Python
5. **Arturo** — official Docker image, ~200 MB
6. **Janet** — multi-stage Alpine build, ~50 MB

### Phase 2: MODERATE — compiled (6 languages)
7. **C3** — prebuilt binary, ~200 MB
8. **Vala** — apt install, ~350 MB
9. **Nelua** — source build, ~300 MB
10. **Hare** — source build (qbe dep), ~300 MB
11. **Koka** — curl install, ~500 MB
12. **Lean 4** — release tarball, ~1 GB

### Phase 3: MODERATE — interpreted/VM (6 languages)
13. **Pike** — official Docker image, ~150 MB
14. **Picat** — binary tarball, ~200 MB
15. **Nushell** — official Docker image, ~200 MB
16. **Fantom** — JVM script mode, ~210 MB
17. **AssemblyScript** — npm + wasmtime, ~280 MB
18. **IDL/GDL** — apt install, ~400 MB

## Per-Language Checklist (same for all)

- [ ] Add to `src/types/index.ts` Language union
- [ ] Add to `src/lib/judge/languages.ts` (config + version + runtime info)
- [ ] Add to `judge-worker-rs/src/types.rs` Language enum
- [ ] Add to `judge-worker-rs/src/languages.rs` config
- [ ] Create `docker/Dockerfile.judge-<lang>`
- [ ] Add service to `docker-compose.yml`
- [ ] Add A+B solution to `tests/e2e/all-languages-judge.spec.ts`
- [ ] Update `docs/languages.md`
- [ ] Build & test Docker image locally
- [ ] Run E2E test

import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

export type EditorThemeDefinition = {
  id: string;
  label: string;
  isDark: boolean;
};

/**
 * Registry of available editor themes.
 * The actual CodeMirror extensions are loaded dynamically to keep the initial bundle small.
 */
export const EDITOR_THEMES: EditorThemeDefinition[] = [
  // Light themes
  { id: "material-lighter", label: "Material Lighter", isDark: false },
  { id: "ayu-light", label: "Ayu Light", isDark: false },
  { id: "clouds", label: "Clouds", isDark: false },
  { id: "noctis-lilac", label: "Noctis Lilac", isDark: false },
  { id: "rose-pine-dawn", label: "Rose Pine Dawn", isDark: false },
  { id: "solarized-light", label: "Solarized Light", isDark: false },
  { id: "smoothy", label: "Smoothy", isDark: false },
  { id: "github-light", label: "GitHub Light", isDark: false },
  { id: "catppuccin-latte", label: "Catppuccin Latte", isDark: false },
  // Dark themes
  { id: "one-dark", label: "One Dark", isDark: true },
  { id: "dracula", label: "Dracula", isDark: true },
  { id: "cobalt", label: "Cobalt", isDark: true },
  { id: "amy", label: "Amy", isDark: true },
  { id: "cool-glow", label: "Cool Glow", isDark: true },
  { id: "espresso", label: "Espresso", isDark: true },
  { id: "tomorrow", label: "Tomorrow", isDark: true },
  { id: "monokai", label: "Monokai", isDark: true },
  { id: "tokyo-night", label: "Tokyo Night", isDark: true },
  { id: "catppuccin-mocha", label: "Catppuccin Mocha", isDark: true },
  { id: "gruvbox-dark", label: "Gruvbox Dark", isDark: true },
  { id: "ayu-dark", label: "Ayu Dark", isDark: true },
];

export const DEFAULT_LIGHT_THEME = "material-lighter";
export const DEFAULT_DARK_THEME = "one-dark";

export function getEditorThemeDefinition(id: string): EditorThemeDefinition | undefined {
  return EDITOR_THEMES.find((t) => t.id === id);
}

// ---------------------------------------------------------------------------
// Inline theme definitions (no extra npm packages)
// ---------------------------------------------------------------------------

function buildTheme(
  editorView: Parameters<typeof EditorView.theme>[0],
  highlightTags: Parameters<typeof HighlightStyle.define>[0]
): Extension[] {
  return [
    EditorView.theme(editorView),
    syntaxHighlighting(HighlightStyle.define(highlightTags)),
  ];
}

function githubLightTheme(): Extension[] {
  return buildTheme(
    {
      "&": { backgroundColor: "#ffffff", color: "#24292e" },
      ".cm-content": { caretColor: "#24292e" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#24292e" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#b3d5f2",
      },
      ".cm-gutters": { backgroundColor: "#f6f8fa", color: "#6a737d", border: "none", borderRight: "1px solid #e1e4e8" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      ".cm-activeLine": { backgroundColor: "#f1f8ff" },
    },
    [
      { tag: tags.keyword, color: "#d73a49" },
      { tag: tags.controlKeyword, color: "#d73a49" },
      { tag: tags.operatorKeyword, color: "#d73a49" },
      { tag: tags.definitionKeyword, color: "#d73a49" },
      { tag: tags.moduleKeyword, color: "#d73a49" },
      { tag: tags.operator, color: "#d73a49" },
      { tag: tags.punctuation, color: "#24292e" },
      { tag: tags.string, color: "#032f62" },
      { tag: tags.special(tags.string), color: "#032f62" },
      { tag: tags.number, color: "#005cc5" },
      { tag: tags.bool, color: "#005cc5" },
      { tag: tags.null, color: "#005cc5" },
      { tag: tags.comment, color: "#6a737d", fontStyle: "italic" },
      { tag: tags.blockComment, color: "#6a737d", fontStyle: "italic" },
      { tag: tags.lineComment, color: "#6a737d", fontStyle: "italic" },
      { tag: tags.docComment, color: "#6a737d", fontStyle: "italic" },
      { tag: tags.function(tags.variableName), color: "#6f42c1" },
      { tag: tags.function(tags.definition(tags.variableName)), color: "#6f42c1" },
      { tag: tags.definition(tags.variableName), color: "#e36209" },
      { tag: tags.variableName, color: "#24292e" },
      { tag: tags.typeName, color: "#6f42c1" },
      { tag: tags.className, color: "#6f42c1" },
      { tag: tags.tagName, color: "#22863a" },
      { tag: tags.attributeName, color: "#6f42c1" },
      { tag: tags.propertyName, color: "#005cc5" },
      { tag: tags.regexp, color: "#032f62" },
      { tag: tags.self, color: "#005cc5" },
      { tag: tags.atom, color: "#005cc5" },
      { tag: tags.escape, color: "#032f62" },
      { tag: tags.heading, color: "#005cc5", fontWeight: "bold" },
      { tag: tags.emphasis, fontStyle: "italic" },
      { tag: tags.strong, fontWeight: "bold" },
      { tag: tags.link, color: "#032f62", textDecoration: "underline" },
      { tag: tags.invalid, color: "#b31d28" },
    ]
  );
}

function catppuccinLatteTheme(): Extension[] {
  return buildTheme(
    {
      "&": { backgroundColor: "#eff1f5", color: "#4c4f69" },
      ".cm-content": { caretColor: "#dc8a78" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#dc8a78" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#acb0be",
      },
      ".cm-gutters": { backgroundColor: "#e6e9ef", color: "#8c8fa1", border: "none", borderRight: "1px solid #ccd0da" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      ".cm-activeLine": { backgroundColor: "#e6e9ef" },
    },
    [
      { tag: tags.keyword, color: "#8839ef" },
      { tag: tags.controlKeyword, color: "#8839ef" },
      { tag: tags.operatorKeyword, color: "#8839ef" },
      { tag: tags.definitionKeyword, color: "#8839ef" },
      { tag: tags.moduleKeyword, color: "#8839ef" },
      { tag: tags.operator, color: "#04a5e5" },
      { tag: tags.punctuation, color: "#4c4f69" },
      { tag: tags.string, color: "#40a02b" },
      { tag: tags.special(tags.string), color: "#fe640b" },
      { tag: tags.number, color: "#fe640b" },
      { tag: tags.bool, color: "#fe640b" },
      { tag: tags.null, color: "#fe640b" },
      { tag: tags.comment, color: "#8c8fa1", fontStyle: "italic" },
      { tag: tags.blockComment, color: "#8c8fa1", fontStyle: "italic" },
      { tag: tags.lineComment, color: "#8c8fa1", fontStyle: "italic" },
      { tag: tags.docComment, color: "#8c8fa1", fontStyle: "italic" },
      { tag: tags.function(tags.variableName), color: "#1e66f5" },
      { tag: tags.function(tags.definition(tags.variableName)), color: "#1e66f5" },
      { tag: tags.definition(tags.variableName), color: "#4c4f69" },
      { tag: tags.variableName, color: "#4c4f69" },
      { tag: tags.typeName, color: "#df8e1d" },
      { tag: tags.className, color: "#df8e1d" },
      { tag: tags.tagName, color: "#d20f39" },
      { tag: tags.attributeName, color: "#fe640b" },
      { tag: tags.propertyName, color: "#1e66f5" },
      { tag: tags.regexp, color: "#40a02b" },
      { tag: tags.self, color: "#e64553" },
      { tag: tags.atom, color: "#fe640b" },
      { tag: tags.escape, color: "#fe640b" },
      { tag: tags.heading, color: "#1e66f5", fontWeight: "bold" },
      { tag: tags.emphasis, fontStyle: "italic" },
      { tag: tags.strong, fontWeight: "bold" },
      { tag: tags.link, color: "#04a5e5", textDecoration: "underline" },
      { tag: tags.invalid, color: "#d20f39" },
    ]
  );
}

function monokaiTheme(): Extension[] {
  return buildTheme(
    {
      "&": { backgroundColor: "#272822", color: "#f8f8f2" },
      ".cm-content": { caretColor: "#f8f8f0" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#f8f8f0" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#49483e",
      },
      ".cm-gutters": { backgroundColor: "#272822", color: "#75715e", border: "none", borderRight: "1px solid #3e3d32" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      ".cm-activeLine": { backgroundColor: "#3e3d32" },
    },
    [
      { tag: tags.keyword, color: "#f92672" },
      { tag: tags.controlKeyword, color: "#f92672" },
      { tag: tags.operatorKeyword, color: "#f92672" },
      { tag: tags.definitionKeyword, color: "#f92672" },
      { tag: tags.moduleKeyword, color: "#f92672" },
      { tag: tags.operator, color: "#f92672" },
      { tag: tags.punctuation, color: "#f8f8f2" },
      { tag: tags.string, color: "#e6db74" },
      { tag: tags.special(tags.string), color: "#e6db74" },
      { tag: tags.number, color: "#ae81ff" },
      { tag: tags.bool, color: "#ae81ff" },
      { tag: tags.null, color: "#ae81ff" },
      { tag: tags.comment, color: "#75715e", fontStyle: "italic" },
      { tag: tags.blockComment, color: "#75715e", fontStyle: "italic" },
      { tag: tags.lineComment, color: "#75715e", fontStyle: "italic" },
      { tag: tags.docComment, color: "#75715e", fontStyle: "italic" },
      { tag: tags.function(tags.variableName), color: "#a6e22e" },
      { tag: tags.function(tags.definition(tags.variableName)), color: "#a6e22e" },
      { tag: tags.definition(tags.variableName), color: "#f8f8f2" },
      { tag: tags.variableName, color: "#f8f8f2" },
      { tag: tags.typeName, color: "#66d9e8" },
      { tag: tags.className, color: "#a6e22e" },
      { tag: tags.tagName, color: "#f92672" },
      { tag: tags.attributeName, color: "#a6e22e" },
      { tag: tags.propertyName, color: "#66d9e8" },
      { tag: tags.regexp, color: "#e6db74" },
      { tag: tags.self, color: "#fd971f" },
      { tag: tags.atom, color: "#ae81ff" },
      { tag: tags.escape, color: "#ae81ff" },
      { tag: tags.heading, color: "#a6e22e", fontWeight: "bold" },
      { tag: tags.emphasis, fontStyle: "italic" },
      { tag: tags.strong, fontWeight: "bold" },
      { tag: tags.link, color: "#66d9e8", textDecoration: "underline" },
      { tag: tags.invalid, color: "#f92672" },
    ]
  );
}

function tokyoNightTheme(): Extension[] {
  return buildTheme(
    {
      "&": { backgroundColor: "#1a1b26", color: "#a9b1d6" },
      ".cm-content": { caretColor: "#c0caf5" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#c0caf5" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#283457",
      },
      ".cm-gutters": { backgroundColor: "#1a1b26", color: "#3b3f5c", border: "none", borderRight: "1px solid #1e2030" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      ".cm-activeLine": { backgroundColor: "#1e2030" },
    },
    [
      { tag: tags.keyword, color: "#bb9af7" },
      { tag: tags.controlKeyword, color: "#bb9af7" },
      { tag: tags.operatorKeyword, color: "#bb9af7" },
      { tag: tags.definitionKeyword, color: "#bb9af7" },
      { tag: tags.moduleKeyword, color: "#bb9af7" },
      { tag: tags.operator, color: "#89ddff" },
      { tag: tags.punctuation, color: "#89ddff" },
      { tag: tags.string, color: "#9ece6a" },
      { tag: tags.special(tags.string), color: "#73daca" },
      { tag: tags.number, color: "#ff9e64" },
      { tag: tags.bool, color: "#ff9e64" },
      { tag: tags.null, color: "#ff9e64" },
      { tag: tags.comment, color: "#565f89", fontStyle: "italic" },
      { tag: tags.blockComment, color: "#565f89", fontStyle: "italic" },
      { tag: tags.lineComment, color: "#565f89", fontStyle: "italic" },
      { tag: tags.docComment, color: "#565f89", fontStyle: "italic" },
      { tag: tags.function(tags.variableName), color: "#7aa2f7" },
      { tag: tags.function(tags.definition(tags.variableName)), color: "#7aa2f7" },
      { tag: tags.definition(tags.variableName), color: "#c0caf5" },
      { tag: tags.variableName, color: "#c0caf5" },
      { tag: tags.typeName, color: "#2ac3de" },
      { tag: tags.className, color: "#ff9e64" },
      { tag: tags.tagName, color: "#f7768e" },
      { tag: tags.attributeName, color: "#73daca" },
      { tag: tags.propertyName, color: "#7aa2f7" },
      { tag: tags.regexp, color: "#b4f9f8" },
      { tag: tags.self, color: "#f7768e" },
      { tag: tags.atom, color: "#ff9e64" },
      { tag: tags.escape, color: "#73daca" },
      { tag: tags.heading, color: "#7aa2f7", fontWeight: "bold" },
      { tag: tags.emphasis, fontStyle: "italic" },
      { tag: tags.strong, fontWeight: "bold" },
      { tag: tags.link, color: "#73daca", textDecoration: "underline" },
      { tag: tags.invalid, color: "#f7768e" },
    ]
  );
}

function catppuccinMochaTheme(): Extension[] {
  return buildTheme(
    {
      "&": { backgroundColor: "#1e1e2e", color: "#cdd6f4" },
      ".cm-content": { caretColor: "#f5e0dc" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#f5e0dc" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#585b70",
      },
      ".cm-gutters": { backgroundColor: "#181825", color: "#585b70", border: "none", borderRight: "1px solid #313244" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      ".cm-activeLine": { backgroundColor: "#181825" },
    },
    [
      { tag: tags.keyword, color: "#cba6f7" },
      { tag: tags.controlKeyword, color: "#cba6f7" },
      { tag: tags.operatorKeyword, color: "#cba6f7" },
      { tag: tags.definitionKeyword, color: "#cba6f7" },
      { tag: tags.moduleKeyword, color: "#cba6f7" },
      { tag: tags.operator, color: "#89dceb" },
      { tag: tags.punctuation, color: "#cdd6f4" },
      { tag: tags.string, color: "#a6e3a1" },
      { tag: tags.special(tags.string), color: "#fab387" },
      { tag: tags.number, color: "#fab387" },
      { tag: tags.bool, color: "#fab387" },
      { tag: tags.null, color: "#fab387" },
      { tag: tags.comment, color: "#6c7086", fontStyle: "italic" },
      { tag: tags.blockComment, color: "#6c7086", fontStyle: "italic" },
      { tag: tags.lineComment, color: "#6c7086", fontStyle: "italic" },
      { tag: tags.docComment, color: "#6c7086", fontStyle: "italic" },
      { tag: tags.function(tags.variableName), color: "#89b4fa" },
      { tag: tags.function(tags.definition(tags.variableName)), color: "#89b4fa" },
      { tag: tags.definition(tags.variableName), color: "#cdd6f4" },
      { tag: tags.variableName, color: "#cdd6f4" },
      { tag: tags.typeName, color: "#f9e2af" },
      { tag: tags.className, color: "#f38ba8" },
      { tag: tags.tagName, color: "#f38ba8" },
      { tag: tags.attributeName, color: "#fab387" },
      { tag: tags.propertyName, color: "#89b4fa" },
      { tag: tags.regexp, color: "#a6e3a1" },
      { tag: tags.self, color: "#f38ba8" },
      { tag: tags.atom, color: "#fab387" },
      { tag: tags.escape, color: "#fab387" },
      { tag: tags.heading, color: "#89b4fa", fontWeight: "bold" },
      { tag: tags.emphasis, fontStyle: "italic" },
      { tag: tags.strong, fontWeight: "bold" },
      { tag: tags.link, color: "#89dceb", textDecoration: "underline" },
      { tag: tags.invalid, color: "#f38ba8" },
    ]
  );
}

function gruvboxDarkTheme(): Extension[] {
  return buildTheme(
    {
      "&": { backgroundColor: "#282828", color: "#ebdbb2" },
      ".cm-content": { caretColor: "#ebdbb2" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#ebdbb2" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#504945",
      },
      ".cm-gutters": { backgroundColor: "#3c3836", color: "#7c6f64", border: "none", borderRight: "1px solid #504945" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      ".cm-activeLine": { backgroundColor: "#3c3836" },
    },
    [
      { tag: tags.keyword, color: "#fb4934" },
      { tag: tags.controlKeyword, color: "#fb4934" },
      { tag: tags.operatorKeyword, color: "#fb4934" },
      { tag: tags.definitionKeyword, color: "#fe8019" },
      { tag: tags.moduleKeyword, color: "#fb4934" },
      { tag: tags.operator, color: "#8ec07c" },
      { tag: tags.punctuation, color: "#ebdbb2" },
      { tag: tags.string, color: "#b8bb26" },
      { tag: tags.special(tags.string), color: "#8ec07c" },
      { tag: tags.number, color: "#d3869b" },
      { tag: tags.bool, color: "#d3869b" },
      { tag: tags.null, color: "#d3869b" },
      { tag: tags.comment, color: "#928374", fontStyle: "italic" },
      { tag: tags.blockComment, color: "#928374", fontStyle: "italic" },
      { tag: tags.lineComment, color: "#928374", fontStyle: "italic" },
      { tag: tags.docComment, color: "#928374", fontStyle: "italic" },
      { tag: tags.function(tags.variableName), color: "#fabd2f" },
      { tag: tags.function(tags.definition(tags.variableName)), color: "#fabd2f" },
      { tag: tags.definition(tags.variableName), color: "#ebdbb2" },
      { tag: tags.variableName, color: "#ebdbb2" },
      { tag: tags.typeName, color: "#83a598" },
      { tag: tags.className, color: "#8ec07c" },
      { tag: tags.tagName, color: "#fb4934" },
      { tag: tags.attributeName, color: "#fabd2f" },
      { tag: tags.propertyName, color: "#83a598" },
      { tag: tags.regexp, color: "#b8bb26" },
      { tag: tags.self, color: "#fe8019" },
      { tag: tags.atom, color: "#d3869b" },
      { tag: tags.escape, color: "#8ec07c" },
      { tag: tags.heading, color: "#fabd2f", fontWeight: "bold" },
      { tag: tags.emphasis, fontStyle: "italic" },
      { tag: tags.strong, fontWeight: "bold" },
      { tag: tags.link, color: "#83a598", textDecoration: "underline" },
      { tag: tags.invalid, color: "#fb4934" },
    ]
  );
}

function ayuDarkTheme(): Extension[] {
  return buildTheme(
    {
      "&": { backgroundColor: "#0d1017", color: "#bfbdb6" },
      ".cm-content": { caretColor: "#e6b450" },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#e6b450" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#33415580",
      },
      ".cm-gutters": { backgroundColor: "#0d1017", color: "#6c7380", border: "none", borderRight: "1px solid #131721" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      ".cm-activeLine": { backgroundColor: "#131721" },
    },
    [
      { tag: tags.keyword, color: "#ff8f40" },
      { tag: tags.controlKeyword, color: "#ff8f40" },
      { tag: tags.operatorKeyword, color: "#ff8f40" },
      { tag: tags.definitionKeyword, color: "#ff8f40" },
      { tag: tags.moduleKeyword, color: "#ff8f40" },
      { tag: tags.operator, color: "#f29668" },
      { tag: tags.punctuation, color: "#bfbdb6" },
      { tag: tags.string, color: "#aad94c" },
      { tag: tags.special(tags.string), color: "#95e6cb" },
      { tag: tags.number, color: "#e6b673" },
      { tag: tags.bool, color: "#e6b673" },
      { tag: tags.null, color: "#e6b673" },
      { tag: tags.comment, color: "#626a73", fontStyle: "italic" },
      { tag: tags.blockComment, color: "#626a73", fontStyle: "italic" },
      { tag: tags.lineComment, color: "#626a73", fontStyle: "italic" },
      { tag: tags.docComment, color: "#626a73", fontStyle: "italic" },
      { tag: tags.function(tags.variableName), color: "#ffb454" },
      { tag: tags.function(tags.definition(tags.variableName)), color: "#ffb454" },
      { tag: tags.definition(tags.variableName), color: "#bfbdb6" },
      { tag: tags.variableName, color: "#bfbdb6" },
      { tag: tags.typeName, color: "#59c2ff" },
      { tag: tags.className, color: "#59c2ff" },
      { tag: tags.tagName, color: "#39bae6" },
      { tag: tags.attributeName, color: "#ffb454" },
      { tag: tags.propertyName, color: "#59c2ff" },
      { tag: tags.regexp, color: "#95e6cb" },
      { tag: tags.self, color: "#e6b450" },
      { tag: tags.atom, color: "#e6b673" },
      { tag: tags.escape, color: "#95e6cb" },
      { tag: tags.heading, color: "#59c2ff", fontWeight: "bold" },
      { tag: tags.emphasis, fontStyle: "italic" },
      { tag: tags.strong, fontWeight: "bold" },
      { tag: tags.link, color: "#59c2ff", textDecoration: "underline" },
      { tag: tags.invalid, color: "#ff3333" },
    ]
  );
}

/**
 * Dynamically load a CodeMirror theme extension by ID.
 * Returns both the theme extension and its highlight style.
 */
export async function loadEditorTheme(id: string): Promise<Extension[]> {
  switch (id) {
    case "material-lighter":
      // Built-in custom theme — handled separately in code-surface.tsx
      return [];
    case "one-dark": {
      const { oneDark } = await import("@codemirror/theme-one-dark");
      return [oneDark];
    }
    case "ayu-light": {
      const { ayuLight } = await import("thememirror");
      return [ayuLight];
    }
    case "clouds": {
      const { clouds } = await import("thememirror");
      return [clouds];
    }
    case "noctis-lilac": {
      const { noctisLilac } = await import("thememirror");
      return [noctisLilac];
    }
    case "rose-pine-dawn": {
      const { rosePineDawn } = await import("thememirror");
      return [rosePineDawn];
    }
    case "solarized-light": {
      const { solarizedLight } = await import("thememirror");
      return [solarizedLight];
    }
    case "smoothy": {
      const { smoothy } = await import("thememirror");
      return [smoothy];
    }
    case "github-light":
      return githubLightTheme();
    case "catppuccin-latte":
      return catppuccinLatteTheme();
    case "dracula": {
      const { dracula } = await import("thememirror");
      return [dracula];
    }
    case "cobalt": {
      const { cobalt } = await import("thememirror");
      return [cobalt];
    }
    case "amy": {
      const { amy } = await import("thememirror");
      return [amy];
    }
    case "cool-glow": {
      const { coolGlow } = await import("thememirror");
      return [coolGlow];
    }
    case "espresso": {
      const { espresso } = await import("thememirror");
      return [espresso];
    }
    case "tomorrow": {
      const { tomorrow } = await import("thememirror");
      return [tomorrow];
    }
    case "monokai":
      return monokaiTheme();
    case "tokyo-night":
      return tokyoNightTheme();
    case "catppuccin-mocha":
      return catppuccinMochaTheme();
    case "gruvbox-dark":
      return gruvboxDarkTheme();
    case "ayu-dark":
      return ayuDarkTheme();
    default:
      return [];
  }
}

export const SAMPLE_CODE = `def fibonacci(n):
    """Generate the first n Fibonacci numbers."""
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

# Print the first 10 numbers
numbers = fibonacci(10)
print(f"Fibonacci: {numbers}")
`;

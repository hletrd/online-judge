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
  // Dark themes
  { id: "one-dark", label: "One Dark", isDark: true },
  { id: "dracula", label: "Dracula", isDark: true },
  { id: "cobalt", label: "Cobalt", isDark: true },
  { id: "amy", label: "Amy", isDark: true },
  { id: "cool-glow", label: "Cool Glow", isDark: true },
  { id: "espresso", label: "Espresso", isDark: true },
  { id: "tomorrow", label: "Tomorrow", isDark: true },
];

export const DEFAULT_LIGHT_THEME = "material-lighter";
export const DEFAULT_DARK_THEME = "one-dark";

export function getEditorThemeDefinition(id: string): EditorThemeDefinition | undefined {
  return EDITOR_THEMES.find((t) => t.id === id);
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

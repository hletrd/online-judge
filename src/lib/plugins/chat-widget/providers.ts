export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface StreamParams {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  maxTokens: number;
}

interface ChatProvider {
  stream(params: StreamParams): Promise<ReadableStream<Uint8Array>>;
}

// ── OpenAI ──────────────────────────────────────────────────────────────────

const openaiProvider: ChatProvider = {
  async stream({ apiKey, model, messages, maxTokens }) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${text}`);
    }

    if (!response.body) throw new Error("No response body from OpenAI");

    return transformSSE(response.body, (data) => {
      if (data === "[DONE]") return null;
      try {
        const parsed = JSON.parse(data);
        return parsed.choices?.[0]?.delta?.content ?? null;
      } catch {
        return null;
      }
    });
  },
};

// ── Claude ───────────────────────────────────────────────────────────────────

const claudeProvider: ChatProvider = {
  async stream({ apiKey, model, messages, maxTokens }) {
    // Separate system message from user/assistant messages
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system");

    const body: Record<string, unknown> = {
      model,
      messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: maxTokens,
      stream: true,
    };

    if (systemMessage) {
      body.system = systemMessage.content;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Claude API error ${response.status}: ${text}`);
    }

    if (!response.body) throw new Error("No response body from Claude");

    return transformSSE(response.body, (data) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
          return parsed.delta.text ?? null;
        }
        return null;
      } catch {
        return null;
      }
    });
  },
};

// ── Gemini ───────────────────────────────────────────────────────────────────

const geminiProvider: ChatProvider = {
  async stream({ apiKey, model, messages, maxTokens }) {
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system");

    const contents = chatMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: { maxOutputTokens: maxTokens },
    };

    if (systemMessage) {
      body.systemInstruction = { parts: [{ text: systemMessage.content }] };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${text}`);
    }

    if (!response.body) throw new Error("No response body from Gemini");

    return transformSSE(response.body, (data) => {
      try {
        const parsed = JSON.parse(data);
        return parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
      } catch {
        return null;
      }
    });
  },
};

// ── SSE Parser ───────────────────────────────────────────────────────────────

function transformSSE(
  body: ReadableStream<Uint8Array>,
  extractText: (data: string) => string | null
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      const reader = body.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (!data) continue;

            const text = extractText(data);
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        }

        // Process remaining buffer
        if (buffer.trim()) {
          const trimmed = buffer.trim();
          if (trimmed.startsWith("data:")) {
            const data = trimmed.slice(5).trim();
            if (data) {
              const text = extractText(data);
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

const providers: Record<string, ChatProvider> = {
  openai: openaiProvider,
  claude: claudeProvider,
  gemini: geminiProvider,
};

export function getProvider(name: string): ChatProvider {
  const provider = providers[name];
  if (!provider) throw new Error(`Unknown chat provider: ${name}`);
  return provider;
}

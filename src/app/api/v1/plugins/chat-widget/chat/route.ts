import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { isPluginEnabled, getPluginState } from "@/lib/plugins/data";
import { getProvider, type ChatMessage } from "@/lib/plugins/chat-widget/providers";
import { checkServerActionRateLimit } from "@/lib/security/api-rate-limit";
import { logger } from "@/lib/logger";

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(10000),
    })
  ).min(1).max(50),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const enabled = await isPluginEnabled("chat-widget");
    if (!enabled) {
      return NextResponse.json({ error: "notConfigured" }, { status: 404 });
    }

    const pluginState = await getPluginState("chat-widget");
    if (!pluginState) {
      return NextResponse.json({ error: "notConfigured" }, { status: 404 });
    }

    const config = pluginState.config as {
      provider: string;
      openaiApiKey: string;
      openaiModel: string;
      claudeApiKey: string;
      claudeModel: string;
      geminiApiKey: string;
      geminiModel: string;
      systemPrompt: string;
      knowledgeBase: string;
      maxTokens: number;
      rateLimitPerMinute: number;
    };

    // Rate limit check
    const rateLimitResult = checkServerActionRateLimit(
      session.user.id,
      "chat-widget",
      config.rateLimitPerMinute,
      60
    );
    if (rateLimitResult) {
      return NextResponse.json({ error: "rateLimit" }, { status: 429 });
    }

    // Parse and validate request body
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalidRequest" }, { status: 400 });
    }

    // Determine API key and model based on provider
    let apiKey: string;
    let model: string;
    switch (config.provider) {
      case "claude":
        apiKey = config.claudeApiKey;
        model = config.claudeModel;
        break;
      case "gemini":
        apiKey = config.geminiApiKey;
        model = config.geminiModel;
        break;
      default: // openai
        apiKey = config.openaiApiKey;
        model = config.openaiModel;
        break;
    }

    if (!apiKey) {
      return NextResponse.json({ error: "notConfigured" }, { status: 500 });
    }

    // Build messages with system prompt
    const messages: ChatMessage[] = [];

    let systemContent = "";
    if (config.systemPrompt) {
      systemContent += config.systemPrompt;
    }
    if (config.knowledgeBase) {
      systemContent += (systemContent ? "\n\n" : "") + "Reference material:\n" + config.knowledgeBase;
    }
    if (systemContent) {
      messages.push({ role: "system", content: systemContent });
    }

    messages.push(...parsed.data.messages);

    // Get provider and stream
    const provider = getProvider(config.provider);
    const stream = await provider.stream({
      apiKey,
      model,
      messages,
      maxTokens: config.maxTokens,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Chat widget API error");
    return NextResponse.json({ error: "internalError" }, { status: 500 });
  }
}

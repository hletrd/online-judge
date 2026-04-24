import { NextResponse } from "next/server";
import { getDbNowMs } from "@/lib/db-time";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ timestamp: await getDbNowMs() });
}

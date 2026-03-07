import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getApiUser, unauthorized, forbidden, isAdmin } from "@/lib/api/auth";
import { nanoid } from "nanoid";
import { hash } from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return forbidden();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    const role = searchParams.get("role");

    let results = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    if (role) {
      results = results.filter((u) => u.role === role);
    }

    return NextResponse.json({ data: results, page, limit });
  } catch (error) {
    console.error("GET /api/v1/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return forbidden();

    const body = await request.json();
    const { email, name, password, role } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const id = nanoid();

    await db.insert(users).values({
      id,
      email,
      name,
      passwordHash,
      role: role || "student",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .then((r) => r[0]);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

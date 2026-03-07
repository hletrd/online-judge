import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApiUser, unauthorized, forbidden, notFound, isAdmin } from "@/lib/api/auth";
import { hash } from "bcryptjs";

const safeUserSelect = {
  id: users.id,
  email: users.email,
  name: users.name,
  role: users.role,
  isActive: users.isActive,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();

    const { id } = await params;

    if (!isAdmin(user.role) && user.id !== id) return forbidden();

    const found = await db
      .select(safeUserSelect)
      .from(users)
      .where(eq(users.id, id))
      .then((r) => r[0]);

    if (!found) return notFound("User");

    return NextResponse.json({ data: found });
  } catch (error) {
    console.error("GET /api/v1/users/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();

    const { id } = await params;

    if (!isAdmin(user.role) && user.id !== id) return forbidden();

    const found = await db
      .select(safeUserSelect)
      .from(users)
      .where(eq(users.id, id))
      .then((r) => r[0]);

    if (!found) return notFound("User");

    const body = await request.json();
    const { name, email, role, isActive, password } = body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (isActive !== undefined && isAdmin(user.role)) updates.isActive = isActive;
    if (role !== undefined) {
      if (!isAdmin(user.role)) return forbidden();
      updates.role = role;
    }
    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updates.passwordHash = await hash(password, 12);
    }

    await db.update(users).set(updates).where(eq(users.id, id));

    const updated = await db
      .select(safeUserSelect)
      .from(users)
      .where(eq(users.id, id))
      .then((r) => r[0]);

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("PATCH /api/v1/users/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();
    if (!isAdmin(user.role)) return forbidden();

    const { id } = await params;

    const found = await db
      .select(safeUserSelect)
      .from(users)
      .where(eq(users.id, id))
      .then((r) => r[0]);

    if (!found) return notFound("User");

    await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, id));

    return NextResponse.json({ data: { id, isActive: false } });
  } catch (error) {
    console.error("DELETE /api/v1/users/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

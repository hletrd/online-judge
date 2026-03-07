import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { groups, enrollments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApiUser, unauthorized, forbidden, isAdmin, isInstructor } from "@/lib/api/auth";
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();

    let results;

    if (isAdmin(user.role) || isInstructor(user.role)) {
      results = await db.query.groups.findMany({
        with: {
          instructor: {
            columns: { id: true, name: true, email: true },
          },
        },
      });
    } else {
      const userEnrollments = await db.query.enrollments.findMany({
        where: eq(enrollments.userId, user.id),
        with: {
          group: {
            with: {
              instructor: {
                columns: { id: true, name: true, email: true },
              },
            },
          },
        },
      });
      results = userEnrollments.map((e) => e.group);
    }

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("GET /api/v1/groups error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return unauthorized();
    if (!isInstructor(user.role)) return forbidden();

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const id = nanoid();
    await db.insert(groups).values({
      id,
      name: name.trim(),
      description: description || null,
      instructorId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const group = await db.query.groups.findFirst({ where: eq(groups.id, id) });
    return NextResponse.json({ data: group }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/groups error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

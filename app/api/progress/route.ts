import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const progress = await prisma.dayProgress.findMany({
      orderBy: { dayIndex: "asc" },
    });
    return NextResponse.json(progress);
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dayIndex, completed } = body as {
      dayIndex: number;
      completed: boolean;
    };

    if (dayIndex < 0 || dayIndex > 29) {
      return NextResponse.json(
        { error: "Invalid dayIndex" },
        { status: 400 }
      );
    }

    const progress = await prisma.dayProgress.upsert({
      where: { dayIndex },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        dayIndex,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("POST /api/progress error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

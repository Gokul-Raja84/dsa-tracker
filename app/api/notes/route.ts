import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { dayIndex, notes, leetcodeUrl } = body as {
      dayIndex: number;
      notes?: string;
      leetcodeUrl?: string;
    };

    if (dayIndex < 0 || dayIndex > 29) {
      return NextResponse.json(
        { error: "Invalid dayIndex" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (notes !== undefined) updateData.notes = notes;
    if (leetcodeUrl !== undefined) updateData.leetcodeUrl = leetcodeUrl;

    const progress = await prisma.dayProgress.upsert({
      where: { dayIndex },
      update: updateData,
      create: {
        dayIndex,
        ...updateData,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("PATCH /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to update notes" },
      { status: 500 }
    );
  }
}

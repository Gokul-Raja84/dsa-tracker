import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    await prisma.dayProgress.deleteMany();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset progress" },
      { status: 500 }
    );
  }
}

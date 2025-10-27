import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.primaryEmailAddress) {
      return NextResponse.json({ error: "No Clerk user found" }, { status: 400 });
    }

    const email = clerkUser.primaryEmailAddress.emailAddress;
    const name = clerkUser.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : "Anonymous";
    const avatar = clerkUser.imageUrl || "";

    await prisma.user.upsert({
      where: { id: userId },
      update: { email, name, avatar },
      create: { id: userId, email, name, avatar },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SYNC_USER_ERROR]", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}

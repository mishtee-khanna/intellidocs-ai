import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId || userId === "local-user") {
      return NextResponse.json({
        user: {
          name: session?.user?.name || "Demo Explorer",
          email: session?.user?.email || "demo@intellidocs.ai"
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true }
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const { name, currentPassword, newPassword } = await req.json();

    if (!userId || userId === "local-user") {
      return NextResponse.json({ success: true, message: "Settings saved for local session." });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();

    if (newPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.password) {
        if (!currentPassword) {
          return NextResponse.json({ error: "Current password is required to set new password" }, { status: 400 });
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}

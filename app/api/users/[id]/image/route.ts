import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/_services/user.service";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = Number(resolvedParams.id);

    if (Number.isNaN(userId)) {
      return new Response(
        JSON.stringify({ message: "ID inválido" }),
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const result = await userService.updateProfileImage(userId, file);

    return NextResponse.json(result);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Failed to update profile image" },
      { status: 500 }
    );
  }
}

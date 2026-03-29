import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async () => {
  try {
    const loveStartDateConfig = await prisma.systemConfig.findUnique({
      where: { key: "loveStartDate" },
    });

    return NextResponse.json({
      success: true,
      data: {
        loveStartDate: loveStartDateConfig?.value || "",
      },
    });
  } catch (error) {
    console.error("[api/config][GET] 获取配置失败", error);
    return NextResponse.json({ message: "获取配置失败" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { loveStartDate } = body;

    if (!loveStartDate) {
      return NextResponse.json(
        { message: "在一起的日期不能为空" },
        { status: 400 }
      );
    }

    // 使用 upsert 确保配置存在
    await prisma.systemConfig.upsert({
      where: { key: "loveStartDate" },
      update: { value: loveStartDate },
      create: { key: "loveStartDate", value: loveStartDate },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/config][POST] 保存配置失败", error);
    return NextResponse.json({ message: "保存配置失败" }, { status: 500 });
  }
};

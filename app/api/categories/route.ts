import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async () => {
  try {
    const categories = await prisma.dishCategory.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('[api/categories][GET] 获取分类失败', error);
    return NextResponse.json({ message: '获取分类失败' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ message: '分类名称不能为空' }, { status: 400 });
    }

    const existedCategory = await prisma.dishCategory.findFirst({
      where: {
        name,
      },
      select: { id: true },
    });

    if (existedCategory) {
      return NextResponse.json({ message: '分类名称已存在，请勿重复创建' }, { status: 400 });
    }

    const newCategory = await prisma.dishCategory.create({
      data: {
        name,
        sortOrder: body.sortOrder,
      },
    });
    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    console.error('[api/categories][POST] 创建分类失败', error);
    return NextResponse.json({ message: '创建分类失败' }, { status: 500 });
  }
};

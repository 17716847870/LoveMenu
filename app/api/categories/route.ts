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
    const newCategory = await prisma.dishCategory.create({
      data: {
        name: body.name,
        sortOrder: body.sortOrder,
      },
    });
    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    console.error('[api/categories][POST] 创建分类失败', error);
    return NextResponse.json({ message: '创建分类失败' }, { status: 500 });
  }
};

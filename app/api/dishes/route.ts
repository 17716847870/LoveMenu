import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async () => {
  try {
    const dishes = await prisma.dish.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      }
    });
    return NextResponse.json({ data: dishes });
  } catch (error) {
    return NextResponse.json({ message: '获取菜品失败' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const newDish = await prisma.dish.create({
      data: {
        name: body.name,
        description: body.description || '',
        categoryId: body.categoryId,
        kissPrice: body.kissPrice,
        hugPrice: body.hugPrice,
        image: body.image,
        allowCook: body.allowCook,
        allowRestaurant: body.allowRestaurant,
      },
    });
    return NextResponse.json({ success: true, data: newDish });
  } catch (error) {
    return NextResponse.json({ message: '创建菜品失败' }, { status: 500 });
  }
};

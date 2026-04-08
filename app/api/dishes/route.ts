import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logApiError } from '@/lib/error-log';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const sortBy = searchParams.get('sortBy') as 'createdAt' | 'popularity' | 'price' | undefined;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';

    console.log('API GET dishes - categoryId:', categoryId);
    console.log('API GET dishes - all params:', Object.fromEntries(searchParams.entries()));

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.kissPrice = sortOrder;
    } else if (sortBy === 'popularity') {
      orderBy.popularity = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const dishes = await prisma.dish.findMany({
      where,
      orderBy,
      include: {
        category: true,
      }
    });
    return NextResponse.json({ data: dishes });
  } catch (error) {
    console.error("[api/dishes][GET] 获取菜品失败", error);
    await logApiError({ req, scope: '/api/dishes[GET]' }, error);
    return NextResponse.json({ message: '获取菜品失败' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log('API POST 接收到的 body:', body);
    console.log('API POST 接收到的 image:', body.image);

    if (!body.categoryId || typeof body.categoryId !== 'string') {
      return NextResponse.json({ message: '请选择菜品分类' }, { status: 400 });
    }

    const categoryExists = await prisma.dishCategory.findUnique({
      where: { id: body.categoryId },
      select: { id: true },
    });

    if (!categoryExists) {
      return NextResponse.json({ message: '所选分类不存在，请重新选择' }, { status: 400 });
    }
    
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
    console.log('API POST 创建的菜品:', newDish);
    return NextResponse.json({ success: true, data: newDish });
  } catch (error) {
    console.error('API POST 错误:', error);
    await logApiError({ req, scope: '/api/dishes[POST]' }, error);
    return NextResponse.json({ message: '创建菜品失败' }, { status: 500 });
  }
};

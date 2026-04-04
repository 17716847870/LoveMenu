import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    console.log('API PUT 接收到的 id:', id);
    console.log('API PUT 接收到的 body:', body);
    console.log('API PUT 接收到的 image:', body.image);

    const existingDish = await prisma.dish.findUnique({
      where: { id },
      select: { id: true, categoryId: true },
    });

    if (!existingDish) {
      return NextResponse.json({ message: '菜品不存在' }, { status: 404 });
    }

    const nextCategoryId = typeof body.categoryId === 'string' && body.categoryId.trim()
      ? body.categoryId.trim()
      : existingDish.categoryId;

    const categoryExists = await prisma.dishCategory.findUnique({
      where: { id: nextCategoryId },
      select: { id: true },
    });

    if (!categoryExists) {
      return NextResponse.json({ message: '所选分类不存在，请重新选择' }, { status: 400 });
    }
    
    const updatedDish = await prisma.dish.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        categoryId: nextCategoryId,
        kissPrice: body.kissPrice,
        hugPrice: body.hugPrice,
        image: body.image,
        allowCook: body.allowCook,
        allowRestaurant: body.allowRestaurant,
      },
    });
    console.log('API PUT 更新的菜品:', updatedDish);

    return NextResponse.json({ success: true, data: updatedDish });
  } catch (error) {
    console.error('API PUT 错误:', error);
    return NextResponse.json({ message: '更新菜品失败' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // 检查是否有关联订单
    const orderItemsCount = await prisma.orderItem.count({
      where: { dishId: id },
    });

    if (orderItemsCount > 0) {
      return NextResponse.json({ message: '该菜品已有订单关联，无法删除' }, { status: 400 });
    }

    await prisma.dish.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/dishes/:id][DELETE] 删除菜品失败', error);
    return NextResponse.json({ message: '删除菜品失败' }, { status: 500 });
  }
}
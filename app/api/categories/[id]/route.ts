import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const data = await req.json();
    const name = data.name?.trim();

    if (!name) {
      return NextResponse.json({ message: '分类名称不能为空' }, { status: 400 });
    }

    const existedCategory = await prisma.dishCategory.findFirst({
      where: {
        name,
        id: { not: id },
      },
      select: { id: true },
    });

    if (existedCategory) {
      return NextResponse.json({ message: '分类名称已存在，请使用其他名称' }, { status: 400 });
    }
    
    const updatedCategory = await prisma.dishCategory.update({
      where: { id },
      data: {
        name,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('[api/categories/:id][PUT] 更新分类失败', error);
    return NextResponse.json({ message: '更新分类失败' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    // 检查是否有菜品关联
    const dishesCount = await prisma.dish.count({
      where: { categoryId: id },
    });

    if (dishesCount > 0) {
      return NextResponse.json({ message: `该分类下还有 ${dishesCount} 道菜品，无法删除` }, { status: 400 });
    }

    await prisma.dishCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/categories/:id][DELETE] 删除分类失败', error);
    return NextResponse.json({ message: '删除分类失败' }, { status: 500 });
  }
}
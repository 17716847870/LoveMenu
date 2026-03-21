import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/oss';

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const path = formData.get('path') as string || 'uploads';
    const filename = formData.get('filename') as string | null;

    if (!file) {
      return NextResponse.json(
        { message: '请上传文件' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: '只支持 JPG、PNG、GIF、WebP 格式的图片' },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: '图片大小不能超过 5MB' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, {
      path,
      filename: filename || undefined,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '上传失败' },
      { status: 500 }
    );
  }
};

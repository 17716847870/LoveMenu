import OSS from 'ali-oss';

const client = new OSS({
  region: process.env.OSS_REGION!,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET!,
});

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  contentType: string;
}

export async function uploadImage(
  file: File | Buffer,
  options: {
    path?: string;
    filename?: string;
  } = {}
): Promise<UploadResult> {
  const { path = 'uploads', filename } = options;
  
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = file instanceof File ? file.name.split('.').pop() : 'jpg';
  const finalFilename = filename || `${timestamp}-${randomStr}.${ext}`;
  
  const objectPath = `${path}/${finalFilename}`;
  
  let buffer: Buffer;
  let contentType: string;
  
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    contentType = file.type || 'image/jpeg';
  } else {
    buffer = file;
    contentType = 'image/jpeg';
  }
  
  try {
    const result = await client.put(objectPath, buffer, {
      headers: {
        'Content-Type': contentType,
      },
    });
    
    return {
      url: result.url,
      name: finalFilename,
      size: buffer.length,
      contentType,
    };
  } catch (error) {
    console.error('OSS upload error:', error);
    throw new Error('图片上传失败');
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const objectPath = urlObj.pathname.substring(1);
    await client.delete(objectPath);
  } catch (error) {
    console.error('OSS delete error:', error);
    throw new Error('图片删除失败');
  }
}

export function getImageUrl(filename: string, path: string = 'uploads'): string {
  return `https://${process.env.OSS_BUCKET}.${process.env.OSS_REGION}.aliyuncs.com/${path}/${filename}`;
}

export { client as ossClient };

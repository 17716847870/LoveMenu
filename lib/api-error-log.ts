import { createErrorLog, normalizeError } from '@/lib/error-log';

export async function withApiErrorLogging<T>(
  context: { req: Request; scope: string },
  handler: () => Promise<T>
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    const normalized = normalizeError(error);

    await createErrorLog({
      source: 'api',
      scope: context.scope,
      path: new URL(context.req.url).pathname,
      method: context.req.method,
      message: normalized.message,
      stack: normalized.stack,
      userAgent: context.req.headers.get('user-agent') ?? undefined,
      url: context.req.url,
    });

    throw error;
  }
}

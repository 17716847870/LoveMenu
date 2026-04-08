import { prisma } from '@/lib/db';

export type ErrorLogSource = 'api' | 'frontend';

export interface CreateErrorLogInput {
  source: ErrorLogSource;
  level?: 'error' | 'warn';
  scope?: string;
  path?: string;
  method?: string;
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  metadata?: Record<string, unknown> | null;
}

interface ApiErrorLogContext {
  req?: Request;
  scope: string;
  path?: string;
  method?: string;
  metadata?: Record<string, unknown> | null;
}

export async function createErrorLog(input: CreateErrorLogInput) {
  try {
    await (prisma as any).errorLog.create({
      data: {
        source: input.source,
        level: input.level ?? 'error',
        scope: input.scope ?? null,
        path: input.path ?? null,
        method: input.method ?? null,
        message: input.message,
        stack: input.stack ?? null,
        url: input.url ?? null,
        userAgent: input.userAgent ?? null,
        metadata: input.metadata ?? undefined,
      },
    });
  } catch (error) {
    console.error('[error-log] 写入失败', error);
  }
}

export function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: typeof error === 'string' ? error : 'Unknown error',
    stack: undefined,
  };
}

export async function logApiError(context: ApiErrorLogContext, error: unknown) {
  const normalized = normalizeError(error);

  await createErrorLog({
    source: 'api',
    scope: context.scope,
    path: context.req ? new URL(context.req.url).pathname : context.path,
    method: context.req?.method ?? context.method,
    message: normalized.message,
    stack: normalized.stack,
    userAgent: context.req?.headers.get('user-agent') ?? undefined,
    url: context.req?.url,
    metadata: context.metadata ?? null,
  });
}

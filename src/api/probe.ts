import { request, ApiError } from './client';

export interface ProbeResult {
  status: number;
  durationMs: number;
  code: string | null;
  body: unknown;
}

// UNVERIFIED
export async function runProbe(path: string): Promise<ProbeResult> {
  const start = performance.now();
  try {
    const data = await request<unknown>(path, { method: 'GET' });
    const durationMs = Math.round(performance.now() - start);
    return {
      status: 200,
      durationMs,
      code: null,
      body: data,
    };
  } catch (err: unknown) {
    const durationMs = Math.round(performance.now() - start);
    if (err instanceof ApiError) {
      let extractedCode: string | null = err.code || null;
      if (!extractedCode && err.raw && typeof err.raw === 'object') {
        const anyRaw = err.raw as { errors?: Array<{ code?: string }> };
        if (anyRaw.errors?.[0]?.code) {
          extractedCode = anyRaw.errors[0].code;
        }
      }
      return {
        status: err.status,
        durationMs,
        code: extractedCode,
        body: err.raw ?? { message: err.message },
      };
    }
    return {
      status: 0,
      durationMs,
      code: null,
      body: { message: err instanceof Error ? err.message : String(err) },
    };
  }
}

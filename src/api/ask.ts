import type { AskResponse } from "../types";

const ASK_URL = "/api/v1/ask";
export const ASK_TIMEOUT_MS = 30000;

export type AskErrorKind = "timeout" | "network" | "server";

export class AskError extends Error {
  kind: AskErrorKind;
  status: number | null;
  detail: string;

  constructor(kind: AskErrorKind, message: string, detail: string, status: number | null = null) {
    super(message);
    this.name = "AskError";
    this.kind = kind;
    this.status = status;
    this.detail = detail;
  }
}

export function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export async function askQuestion(question: string, signal: AbortSignal): Promise<AskResponse> {
  const combined = AbortSignal.any([signal, AbortSignal.timeout(ASK_TIMEOUT_MS)]);

  let response: Response;
  try {
    response = await fetch(ASK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: combined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new AskError(
        "timeout",
        `Server tidak merespons dalam ${ASK_TIMEOUT_MS / 1000} detik. Kirim ulang pertanyaan.`,
        `Timeout setelah ${ASK_TIMEOUT_MS / 1000} detik pada POST ${ASK_URL}`,
      );
    }
    if (isAbort(error)) {
      throw error;
    }
    throw new AskError(
      "network",
      "Tidak dapat terhubung ke server. Periksa koneksi, lalu kirim ulang pertanyaan.",
      error instanceof Error ? error.message : String(error),
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new AskError(
      "server",
      "Server gagal menyusun jawaban. Kirim ulang pertanyaan.",
      `HTTP ${response.status} pada POST ${ASK_URL}${body ? `: ${body}` : ""}`,
      response.status,
    );
  }

  const data: AskResponse = await response.json();
  return data;
}

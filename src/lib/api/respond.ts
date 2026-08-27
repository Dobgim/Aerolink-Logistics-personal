import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fieldErrors } from "@/lib/validations/schemas";
import { getSessionUser, type SessionUser } from "@/lib/auth/session";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function unauthorized(message = "Authentication required") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "You do not have access to this resource") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = "Resource not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Something went wrong on our side") {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * Wraps a handler so validation errors become 400s with per-field messages and
 * anything unexpected becomes a 500 without leaking internals to the client.
 */
export async function handle<T>(fn: () => Promise<T>): Promise<T | NextResponse> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Please correct the highlighted fields", details: fieldErrors(error) },
        { status: 400 },
      );
    }
    console.error("[api]", error);
    return serverError();
  }
}

/**
 * Server-side authorization gate for every admin API route. Route protection is
 * enforced here, not in the browser.
 */
export async function requireAdmin(): Promise<
  { user: SessionUser } | { response: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) return { response: unauthorized() };
  if (user.role !== "admin") return { response: forbidden("Administrator access required") };
  return { user };
}

export function isResponse(value: unknown): value is { response: NextResponse } {
  return typeof value === "object" && value !== null && "response" in value;
}

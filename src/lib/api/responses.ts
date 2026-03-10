import { NextResponse } from "next/server";
import type { ApiErrorResponse, ApiSuccessResponse, PaginatedResponse } from "@/types/api";

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccessResponse<T>>({ data }, init);
}

export function apiError(
  error: string,
  status: number,
  resource?: string,
  init?: Omit<ResponseInit, "status">
) {
  const body: ApiErrorResponse = resource ? { error, resource } : { error };
  return NextResponse.json(body, { ...init, status });
}

export function apiPaginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  init?: ResponseInit
) {
  return NextResponse.json<PaginatedResponse<T>>({ data, page, limit, total }, init);
}

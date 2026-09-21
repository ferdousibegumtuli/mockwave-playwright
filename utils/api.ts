import { APIRequestContext } from "@playwright/test";
import fs from "node:fs";

const API_BASE = "https://api.mockwave.io/api/v1";
const STATE_PATH = "playwright/.auth/admin.json";

export interface Endpoint {
  id: number;
  endpoint: string;
  method: string;
  project_id: number;
  project_name?: string;
}

export interface ResponseRule {
  id: number;
  field_type: string;
  field_name: string;
  operator: string;
  rule_action: string;
}

export interface ResponseItem {
  id: number;
  endpoint_id: number;
  response_code: number;
  response: unknown;
  rules?: ResponseRule[];
}

/**
 * The account JWT is persisted as a plain `token` cookie inside the saved
 * auth state (written by global-setup.ts), so the API calls below can
 * authenticate with `Authorization: Bearer <token>`.
 */
export function readAuthToken(): string {
  const state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  const cookie = (state.cookies || []).find(
    (c: { name: string }) => c.name === "token",
  );
  return cookie?.value || "";
}

export async function authHeaders(request: APIRequestContext) {
  return { Authorization: `Bearer ${readAuthToken()}` };
}

export async function listEndpoints(request: APIRequestContext) {
  const res = await request.get(
    `${API_BASE}/endpoint?current_page=1&offset=200&pagesize=200&endpoint=&project_id=&method=&search=`,
    { headers: await authHeaders(request) },
  );
  const body: { data?: Endpoint[] } = await res.json();
  return body.data || [];
}

export async function deleteEndpoint(
  request: APIRequestContext,
  id: number,
) {
  await request.delete(`${API_BASE}/endpoint/${id}`, {
    headers: await authHeaders(request),
  });
}

export async function listResponses(
  request: APIRequestContext,
  endpointId: number,
) {
  const res = await request.get(`${API_BASE}/response/${endpointId}`, {
    headers: await authHeaders(request),
  });
  const body: { data?: ResponseItem[] } = await res.json();
  return body.data || [];
}

export async function deleteResponse(
  request: APIRequestContext,
  id: number,
) {
  await request.delete(`${API_BASE}/response/delete/${id}`, {
    headers: await authHeaders(request),
  });
}

/**
 * Deletes every endpoint whose name starts with `prefix` and all the
 * responses configured for them. Used as the afterEach safety net so test
 * data never accumulates on the shared account.
 */
export async function deleteEndpointsByPrefix(
  request: APIRequestContext,
  prefix: string,
) {
  const endpoints = await listEndpoints(request);
  for (const ep of endpoints) {
    if (ep.endpoint.startsWith(prefix)) {
      const responses = await listResponses(request, ep.id);
      for (const r of responses) await deleteResponse(request, r.id);
      await deleteEndpoint(request, ep.id);
    }
  }
}

/** Deletes every response configured for one endpoint. */
export async function deleteResponsesForEndpoint(
  request: APIRequestContext,
  endpointId: number,
) {
  const responses = await listResponses(request, endpointId);
  for (const r of responses) await deleteResponse(request, r.id);
}
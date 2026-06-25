import type {
  ApiErrorBody,
  BracketResponse,
  FixtureMatch,
  Player,
  RankedAssister,
  RankedScorer,
  Session,
  StandingsResponse,
  SubmitResultPayload,
  Team,
} from "../types/api";

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
  const trimmed = raw.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}
const API_BASE_URL = resolveApiBaseUrl();
const SESSION_KEY = "rest-in-peace-session";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function getStoredSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(
      body.error ?? "No se pudo completar la solicitud",
      response.status,
      body.code,
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  login(username: string, password: string) {
    return request<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  register(username: string, password: string) {
    return request<Session>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  teams(token: string) {
    return request<Team[]>("/teams", {}, token);
  },
  fixture(token: string) {
    return request<FixtureMatch[]>("/me/fixture", {}, token);
  },
  standings(token: string) {
    return request<StandingsResponse>("/me/standings", {}, token);
  },
  bracket(token: string) {
    return request<BracketResponse>("/me/bracket", {}, token);
  },
  scorers(token: string) {
    return request<{ scorers: RankedScorer[] }>("/me/stats/scorers", {}, token);
  },
  assisters(token: string) {
    return request<{ assisters: RankedAssister[] }>(
      "/me/stats/assisters",
      {},
      token,
    );
  },
  players(token: string, teamId: number) {
    return request<Player[]>(`/players?teamId=${teamId}`, {}, token);
  },
  submitResult(token: string, matchId: number, payload: SubmitResultPayload) {
    return request(
      `/me/matches/${matchId}/result`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    );
  },
  deleteResult(token: string, matchId: number) {
    return request(
      `/me/matches/${matchId}/result`,
      { method: "DELETE" },
      token,
    );
  },
};

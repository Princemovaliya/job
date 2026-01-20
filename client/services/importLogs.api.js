const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const buildHeaders = (token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const parseJson = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const requestAuthToken = async ({ apiKey }) => {
  const response = await fetch(`${API_BASE}/api/auth/token`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ apiKey })
  });

  return parseJson(response);
};

export const fetchImportLogs = async ({
  token,
  page = 1,
  limit = 20,
  source,
  sourceUrl
} = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (source) {
    params.set("source", source);
  }
  if (sourceUrl) {
    params.set("sourceUrl", sourceUrl);
  }

  const response = await fetch(
    `${API_BASE}/api/import-logs?${params.toString()}`,
    {
      headers: buildHeaders(token)
    }
  );

  return parseJson(response);
};

export const fetchImportLogById = async ({ token, id }) => {
  const response = await fetch(`${API_BASE}/api/import-logs/${id}`, {
    headers: buildHeaders(token)
  });

  return parseJson(response);
};

export const runImport = async ({ token, sourceId, sourceUrl } = {}) => {
  const response = await fetch(`${API_BASE}/api/imports/run`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ sourceId, sourceUrl })
  });

  return parseJson(response);
};

import { useEffect, useState } from "react";
import ImportTable from "../components/ImportTable";
import {
  fetchImportLogs,
  requestAuthToken,
  runImport
} from "../services/importLogs.api";

const TOKEN_KEY = "job_portal_admin_token";

export default function HomePage() {
  const [token, setToken] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    loadLogs(page);
  }, [token, page]);

  const loadLogs = async (targetPage) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchImportLogs({ token, page: targetPage });
      setLogs(response.data || []);
      setMeta(response.meta || null);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load import logs");
    } finally {
      setLoading(false);
    }
  };

  const handleGetToken = async () => {
    setAuthLoading(true);
    setError("");
    try {
      const response = await requestAuthToken({ apiKey });
      const nextToken = response.token || "";
      if (!nextToken) {
        throw new Error("Token not returned");
      }
      setToken(nextToken);
      window.localStorage.setItem(TOKEN_KEY, nextToken);
    } catch (authError) {
      setError(authError.message || "Failed to get token");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleClearToken = () => {
    setToken("");
    window.localStorage.removeItem(TOKEN_KEY);
  };

  const handleRunImport = async () => {
    setRunLoading(true);
    setError("");
    try {
      await runImport({ token });
      await loadLogs(page);
    } catch (runError) {
      setError(runError.message || "Failed to enqueue import");
    } finally {
      setRunLoading(false);
    }
  };

  const hasNext = meta ? page < meta.pages : false;
  const hasPrev = page > 1;

  return (
    <main className="container">
      <header className="page-header">
        <h1>Import History</h1>
        <p>View each feed import and its totals.</p>
      </header>

      <section className="card">
        <h2>Admin Access</h2>
        <div className="row">
          <input
            type="password"
            placeholder="Admin API key"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
          <button onClick={handleGetToken} disabled={authLoading || !apiKey}>
            {authLoading ? "Generating..." : "Get Token"}
          </button>
          {token && (
            <button className="ghost" onClick={handleClearToken}>
              Clear Token
            </button>
          )}
        </div>
        {token && <p className="muted">Token active.</p>}
      </section>

      <section className="card">
        <div className="row space-between">
          <h2>Runs</h2>
          <div className="row">
            <button onClick={() => loadLogs(page)} disabled={!token || loading}>
              Refresh
            </button>
            <button
              onClick={handleRunImport}
              disabled={!token || runLoading}
            >
              {runLoading ? "Queued..." : "Run Import"}
            </button>
          </div>
        </div>
      </section>

      <ImportTable logs={logs} loading={loading} error={error} />

      {meta && (
        <section className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={!hasPrev}>
            Previous
          </button>
          <span>
            Page {page} of {meta.pages}
          </span>
          <button onClick={() => setPage(page + 1)} disabled={!hasNext}>
            Next
          </button>
        </section>
      )}
    </main>
  );
}

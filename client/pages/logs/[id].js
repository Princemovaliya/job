import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchImportLogById } from "../../services/importLogs.api";

const TOKEN_KEY = "job_portal_admin_token";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
};

export default function ImportLogDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState("");
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);
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
    if (!id || !token) {
      return;
    }

    loadLog(id);
  }, [id, token]);

  const loadLog = async (logId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchImportLogById({ token, id: logId });
      setLog(response.data || null);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load log");
    } finally {
      setLoading(false);
    }
  };

  const totals = log?.totals || {};
  const failures = log?.failures || [];

  return (
    <main className="container">
      <header className="page-header">
        <h1>Import Log Details</h1>
        <Link href="/">Back to history</Link>
      </header>

      {!token && (
        <p className="error">Missing token. Go back and sign in first.</p>
      )}

      {loading && <p>Loading log...</p>}
      {error && <p className="error">{error}</p>}

      {log && (
        <>
          <section className="card">
            <h2>Summary</h2>
            <div className="grid">
              <div>
                <strong>File Name</strong>
                <p>{log.fileName || log.sourceUrl || log.source}</p>
              </div>
              <div>
                <strong>Status</strong>
                <p>{log.status}</p>
              </div>
              <div>
                <strong>Started</strong>
                <p>{formatDate(log.startedAt || log.createdAt)}</p>
              </div>
              <div>
                <strong>Finished</strong>
                <p>{formatDate(log.finishedAt)}</p>
              </div>
              <div>
                <strong>Total Imported</strong>
                <p>{totals.imported ?? 0}</p>
              </div>
              <div>
                <strong>Total Fetched</strong>
                <p>{totals.fetched ?? 0}</p>
              </div>
              <div>
                <strong>New</strong>
                <p>{totals.new ?? 0}</p>
              </div>
              <div>
                <strong>Updated</strong>
                <p>{totals.updated ?? 0}</p>
              </div>
              <div>
                <strong>Failed</strong>
                <p>{totals.failed ?? 0}</p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2>Failures</h2>
            {failures.length === 0 && <p>No failures recorded.</p>}
            {failures.length > 0 && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>External ID</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failures.map((failure, index) => (
                      <tr key={`${failure.externalId || "fail"}-${index}`}>
                        <td>{failure.externalId || "-"}</td>
                        <td>{failure.reason || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

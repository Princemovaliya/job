import ImportRow from "./ImportRow";

export default function ImportTable({ logs = [], loading, error }) {
  return (
    <section className="card">
      <h2>Import History</h2>

      {loading && <p>Loading imports...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && logs.length === 0 && !error && (
        <p>No imports found yet.</p>
      )}

      {logs.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>File Name (URL)</th>
                <th>Total</th>
                <th>New</th>
                <th>Updated</th>
                <th>Failed</th>
                <th>Timestamp</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <ImportRow key={log._id} log={log} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

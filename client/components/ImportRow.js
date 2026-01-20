import Link from "next/link";

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

export default function ImportRow({ log }) {
  const totals = log?.totals || {};
  const fileName = log?.fileName || log?.sourceUrl || log?.source || "-";

  return (
    <tr>
      <td className="truncate" title={fileName}>
        {fileName}
      </td>
      <td>{totals.imported ?? 0}</td>
      <td>{totals.new ?? 0}</td>
      <td>{totals.updated ?? 0}</td>
      <td>{totals.failed ?? 0}</td>
      <td>{formatDate(log?.startedAt || log?.createdAt)}</td>
      <td>
        <Link href={`/logs/${log?._id}`}>View</Link>
      </td>
    </tr>
  );
}

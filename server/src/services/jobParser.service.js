const crypto = require("crypto");

const normalizeToArray = (value) => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const getText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return getText(value[0]);
  }

  if (typeof value === "object") {
    return (
      getText(value._) ||
      getText(value["#text"]) ||
      getText(value.value) ||
      getText(value.term) ||
      getText(value.name) ||
      ""
    );
  }

  return "";
};

const getLink = (linkValue) => {
  if (!linkValue) {
    return "";
  }

  if (typeof linkValue === "string") {
    return linkValue.trim();
  }

  if (Array.isArray(linkValue)) {
    return getLink(linkValue[0]);
  }

  if (typeof linkValue === "object") {
    if (linkValue.href) {
      return String(linkValue.href).trim();
    }

    return getText(linkValue);
  }

  return "";
};

const hashValue = (value) =>
  crypto.createHash("sha256").update(String(value)).digest("hex");

const parseDate = (value) => {
  const text = getText(value);
  if (!text) {
    return null;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildExternalId = (item, source) => {
  const guid = getText(item.guid);
  if (guid) {
    return guid;
  }

  const id = getText(item.id);
  if (id) {
    return id;
  }

  const link = getLink(item.link);
  if (link) {
    return link;
  }

  const title = getText(item.title);
  if (!title) {
    return "";
  }

  const seed = [
    source,
    title,
    getText(item.company || item["job:company"] || item.creator),
    getText(item.location || item["job:location"] || item.region),
    getText(item.pubDate || item.published || item.updated)
  ].join("|");

  return hashValue(seed);
};

const parseJobs = (rawItems, source, sourceUrl) => {
  if (!Array.isArray(rawItems)) {
    return { jobs: [], failures: [] };
  }

  const jobs = [];
  const failures = [];
  const seen = new Set();

  for (const item of rawItems) {
    const externalId = buildExternalId(item, source);
    const title = getText(item.title);

    if (!externalId || !title) {
      failures.push({
        externalId: externalId || null,
        reason: "Missing externalId or title"
      });
      continue;
    }

    if (seen.has(externalId)) {
      continue;
    }

    seen.add(externalId);

    const categories = normalizeToArray(item.category).map((entry) =>
      getText(entry)
    );

    jobs.push({
      externalId,
      source,
      sourceUrl,
      title,
      company: getText(item.company || item["job:company"] || item.creator),
      location: getText(item.location || item["job:location"] || item.region),
      description: getText(
        item["content:encoded"] ||
          item.description ||
          item.summary ||
          item.content
      ),
      url: getLink(item.link) || getText(item.guid),
      categories: categories.filter(Boolean),
      jobType: getText(item["job:employmentType"] || item.jobType),
      postedAt: parseDate(item.pubDate || item.published || item.updated),
      raw: item
    });
  }

  return { jobs, failures };
};

module.exports = { parseJobs };

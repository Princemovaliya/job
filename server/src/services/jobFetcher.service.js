const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const env = require("../config/env");

const normalizeToArray = (value) => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

const extractItems = (json) => {
  if (!json) {
    return [];
  }

  if (json.rss?.channel?.item) {
    return normalizeToArray(json.rss.channel.item);
  }

  if (json.channel?.item) {
    return normalizeToArray(json.channel.item);
  }

  if (json.feed?.entry) {
    return normalizeToArray(json.feed.entry);
  }

  return [];
};

const fetchJobs = async (sourceUrl) => {
  if (!sourceUrl) {
    return { items: [], feed: null };
  }

  const response = await axios.get(sourceUrl, {
    timeout: env.REQUEST_TIMEOUT_MS,
    responseType: "text",
    headers: {
      "User-Agent": "job-importer/1.0"
    }
  });

  const xml = response.data;
  const feed = await parseStringPromise(xml, {
    explicitArray: false,
    trim: true,
    mergeAttrs: true
  });

  return { items: extractItems(feed), feed };
};

module.exports = { fetchJobs };

const chunkArray = (items, size) => {
  const chunks = [];

  if (!Array.isArray(items) || size <= 0) {
    return chunks;
  }

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

module.exports = { chunkArray };

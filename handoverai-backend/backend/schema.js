function makeRecord({ source, rtype, title, body = "", author = "unknown", date = null, url = "", state = null, ...extra }) {
  return {
    source,
    rtype,
    title,
    body,
    author,
    date,
    url,
    state,
    ...extra
  };
}

module.exports = { makeRecord };

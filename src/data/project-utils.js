export function getProjectGroups(projects) {
  const visible = projects
    .filter((project) => project.visible)
    .toSorted((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const featured = visible.filter((project) => project.featured).slice(0, 4);
  const featuredIds = new Set(featured.map((project) => project.id));

  return {
    featured,
    archive: visible.filter((project) => !featuredIds.has(project.id)),
  };
}

export function safeProjectUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

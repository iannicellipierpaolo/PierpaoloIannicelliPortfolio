import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getProjectGroups, safeProjectUrl } from '../src/data/project-utils.js';

const configured = JSON.parse(
  await readFile(new URL('../src/data/projects.json', import.meta.url)),
);
const makeProject = (id, order, featured = false, visible = true) => ({
  id,
  order,
  featured,
  visible,
});
const initial = [1, 2, 3, 4].map((n) => ({
  ...makeProject(`project-${n}`, n, true),
  status: 'placeholder',
  url: '',
}));

test('Configured project data has unique IDs, valid fields and safe URLs', () => {
  assert.equal(new Set(configured.map((p) => p.id)).size, configured.length);
  for (const project of configured) {
    assert.ok(typeof project.id === 'string' && project.id.length > 0);
    assert.ok(typeof project.name === 'string' && project.name.length > 0);
    assert.equal(typeof project.category, 'string');
    assert.equal(typeof project.screenshot, 'string');
    assert.equal(typeof project.url, 'string');
    assert.ok(Number.isFinite(project.order));
    assert.equal(typeof project.visible, 'boolean');
    assert.equal(typeof project.featured, 'boolean');
    assert.ok(['placeholder', 'demo', 'real'].includes(project.status));
    if (project.url) assert.ok(safeProjectUrl(project.url));
  }
  assert.ok(getProjectGroups(configured).featured.length <= 4);
});

test('Initial selection has exactly four distinct visible placeholders and no invented URLs', () => {
  const { featured, archive } = getProjectGroups(initial);
  assert.equal(featured.length, 4);
  assert.equal(new Set(featured.map((project) => project.id)).size, 4);
  assert.equal(archive.length, 0);
  assert.ok(
    featured.every((project) => project.status === 'placeholder' && project.url === ''),
  );
});

test('New non-featured projects enter only the archive', () => {
  const extra = makeProject('new-project', 5);
  const groups = getProjectGroups([...initial, extra]);
  assert.equal(groups.featured.length, 4);
  assert.deepEqual(groups.archive, [extra]);
});

test('More than four featured projects: first four by order are featured, overflow goes to archive', () => {
  const projects = [6, 5, 4, 3, 2, 1].map((n) => makeProject(`item-${n}`, n, true));
  const { featured, archive } = getProjectGroups(projects);
  assert.deepEqual(
    featured.map((item) => item.order),
    [1, 2, 3, 4],
  );
  assert.deepEqual(
    archive.map((item) => item.order),
    [5, 6],
  );
  assert.ok(archive.every((item) => !featured.includes(item)));
});

test('Hidden projects never appear and sorting does not mutate source', () => {
  const projects = [
    makeProject('b', 2),
    makeProject('hidden', 0, true, false),
    makeProject('a', 1),
  ];
  const snapshot = structuredClone(projects);
  const { featured, archive } = getProjectGroups(projects);
  assert.equal(featured.length, 0);
  assert.deepEqual(
    archive.map((project) => project.id),
    ['a', 'b'],
  );
  assert.deepEqual(projects, snapshot);
});

test('Promoting an archive entry and demoting a featured entry keeps four without duplicates', () => {
  const projects = structuredClone(initial);
  projects[0].featured = false;
  projects.push(makeProject('new-featured', 5, true));
  const { featured, archive } = getProjectGroups(projects);
  assert.equal(featured.length, 4);
  assert.equal(archive[0].id, projects[0].id);
  assert.ok(featured.some((project) => project.id === 'new-featured'));
});

test('Empty data and ties are handled deterministically', () => {
  assert.deepEqual(getProjectGroups([]), { featured: [], archive: [] });
  assert.deepEqual(
    getProjectGroups([makeProject('b', 1), makeProject('a', 1)]).archive.map(
      (p) => p.id,
    ),
    ['a', 'b'],
  );
});

test('Missing, invalid, script and data links are not made clickable', () => {
  for (const value of [
    '',
    null,
    'not-a-url',
    'javascript:alert(1)',
    'data:text/html,hello',
    'ftp://example.com',
  ]) {
    assert.equal(safeProjectUrl(value), null);
  }
});

test('Configured HTTP and HTTPS links are accepted', () => {
  assert.equal(
    safeProjectUrl('https://example.com/demo/'),
    'https://example.com/demo/',
  );
  assert.equal(safeProjectUrl('http://localhost:8080/'), 'http://localhost:8080/');
});

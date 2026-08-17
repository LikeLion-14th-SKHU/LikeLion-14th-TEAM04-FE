import assert from 'node:assert/strict'

const baseUrl = process.env.API_BASE_URL ?? 'https://api.memory-atelier.store/api/v1'
const docs = await fetch(`${baseUrl}/api-docs`).then((response) => response.json())

assert.ok(docs.paths['/me/public-settings'].get)
assert.ok(docs.paths['/me/public-settings/collection'].patch)
assert.ok(docs.paths['/me/public-settings/cards/{conceptId}'].patch)
console.log('Public settings API contract check passed')

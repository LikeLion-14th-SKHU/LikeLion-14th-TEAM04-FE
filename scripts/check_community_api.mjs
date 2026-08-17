import assert from 'node:assert/strict'

const baseUrl = process.env.API_BASE_URL ?? 'https://api.memory-atelier.store/api/v1'
const response = await fetch(`${baseUrl}/community/editions`)
const json = await response.json()

assert.equal(response.ok, true)
assert.equal(json.success, true)
assert.ok(Array.isArray(json.data.content))
console.log('Community API check passed')

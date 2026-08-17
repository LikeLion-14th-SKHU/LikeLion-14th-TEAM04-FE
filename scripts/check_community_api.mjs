import assert from 'node:assert/strict'

const baseUrl = process.env.API_BASE_URL ?? 'https://api.memory-atelier.store/api/v1'
const response = await fetch(`${baseUrl}/community/editions`)
const json = await response.json()

assert.equal(response.ok, true)
assert.equal(json.success, true)
assert.ok(Array.isArray(json.data.content))

// 닉네임 검색은 사람 목록을 이 엔드포인트에서 받는다 — 봉투와 nickname 파라미터가 살아있어야 한다
const collections = await fetch(`${baseUrl}/community/collections?nickname=%EA%B5%AC&size=5`)
const collectionsJson = await collections.json()
assert.equal(collections.ok, true)
assert.equal(collectionsJson.success, true)
assert.ok(Array.isArray(collectionsJson.data.content))
console.log('Community API check passed')

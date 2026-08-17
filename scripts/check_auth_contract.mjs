import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const baseUrl = process.env.API_BASE_URL ?? 'https://api.memory-atelier.store/api/v1'
const docs = await fetch(`${baseUrl}/api-docs`).then((response) => response.json())

assert.ok(docs.paths['/auth/signup'].post)
assert.ok(docs.paths['/auth/login'].post)
assert.ok(docs.paths['/auth/reissue'].post)
assert.deepEqual(docs.components.schemas.LoginRequestDto.required.sort(), ['email', 'password'])
assert.deepEqual(docs.components.schemas.SignupRequestDto.required.sort(), ['email', 'nickname', 'password'])

const authSource = await readFile(new URL('../src/api/auth.js', import.meta.url), 'utf8')
assert.match(
  authSource,
  /redirect_uri: `\$\{window\.location\.origin\}\/auth\/\$\{provider\}\/callback`/,
)
console.log('Auth API contract check passed')

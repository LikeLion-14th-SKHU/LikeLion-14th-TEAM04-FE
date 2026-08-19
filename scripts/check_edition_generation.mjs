import assert from 'node:assert/strict'

const baseUrl = process.env.API_BASE_URL ?? 'https://api.memory-atelier.store/api/v1'
const docs = await fetch(`${baseUrl}/api-docs`).then((response) => response.json())

// 생성 흐름: 추억 등록 → AI 분석 → 콘셉트 3장 생성 요청 → 진행 상태 폴링 → 잠금 해제
assert.ok(docs.paths['/memories'].post)
assert.ok(docs.paths['/memories/{memoryId}/analyze'].post)
assert.ok(docs.paths['/memories/{memoryId}/edition-generations'].post)
assert.ok(docs.paths['/edition-generations/{generationId}'].get)
assert.ok(docs.paths['/edition-concepts/{conceptId}/unlock'].post)

// 콘셉트 화면은 회차 이력을, 완료 화면은 에디션명 선택을 쓴다
assert.ok(docs.paths['/memories/{memoryId}/edition-generations'].get)
assert.ok(docs.paths['/edition-generations/{generationId}/edition-name'].patch)

// 이력 응답은 페이지라 content 로 감싸여 있다
assert.ok(
    docs.components.schemas.PageResponseEditionGenerationResponseDto
        .properties.content,
)

// 사진은 파일이라 multipart 로 보낸다
assert.ok(
    docs.paths['/memories'].post.requestBody.content['multipart/form-data'],
)

// 생성 요청은 목표 카테고리 두 개가 모두 필수다
assert.deepEqual(
    docs.components.schemas.EditionGenerationRequestDto.required,
    ['categoryMain', 'categorySub'],
)

// 폴링은 이 상태값으로 끝을 판단한다
assert.deepEqual(
    docs.components.schemas.EditionConceptResponseDto.properties.status.enum,
    ['PENDING', 'IMAGE_READY', 'FAILED'],
)

console.log('Edition generation API contract check passed')

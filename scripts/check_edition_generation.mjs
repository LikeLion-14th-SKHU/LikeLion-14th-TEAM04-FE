import assert from 'node:assert/strict'
import {
    arrangeConcepts,
    isSelectable,
} from '../src/pages/EditionCreate/conceptOrder.js'
import { bucketOf } from '../src/pages/Collection/categoryBucket.js'

const baseUrl = process.env.API_BASE_URL ?? 'https://api.memory-atelier.store/api/v1'
const docs = await fetch(`${baseUrl}/api-docs`).then((response) => response.json())

// 생성 흐름: 추억 등록 → AI 분석 → 콘셉트 3장 생성 요청 → 진행 상태 폴링 → 잠금 해제
assert.ok(docs.paths['/memories'].post)
assert.ok(docs.paths['/memories/{memoryId}/analyze'].post)
assert.ok(docs.paths['/memories/{memoryId}/story-source'].patch)
assert.ok(docs.paths['/memories/{memoryId}/edition-generations'].post)
assert.ok(docs.paths['/edition-generations/{generationId}'].get)
assert.ok(docs.paths['/edition-concepts/{conceptId}/unlock'].post)
assert.ok(docs.paths['/edition-concepts/{conceptId}/certificate'].get)
assert.ok(docs.paths['/edition-concepts/{conceptId}/certificate'].post)
assert.ok(docs.paths['/me/collection'].get)

// 콘셉트 화면은 회차 이력을, 완료 화면은 에디션명 선택을 쓴다
assert.ok(docs.paths['/memories/{memoryId}/edition-generations'].get)
assert.ok(docs.paths['/edition-generations/{generationId}/edition-name'].patch)

// 보증서 조회와 최종 확정은 본문 없이 conceptId 경로 변수만 보내고 같은 응답을 받는다
const certificatePath = docs.paths['/edition-concepts/{conceptId}/certificate']
const certificateResponseRef =
    '#/components/schemas/ApiResponseCertificateResponseDto'

assert.equal(certificatePath.get.requestBody, undefined)
assert.equal(certificatePath.post.requestBody, undefined)
assert.equal(
    certificatePath.get.responses['200'].content['*/*'].schema.$ref,
    certificateResponseRef,
)
assert.equal(
    certificatePath.post.responses['200'].content['*/*'].schema.$ref,
    certificateResponseRef,
)
assert.ok(docs.components.schemas.CertificateResponseDto.properties.conceptId)
assert.ok(docs.components.schemas.CertificateResponseDto.properties.certificate)

// 컬렉션 요약은 전체 개수와 보증서 발급 시각으로 계산한다
assert.ok(
    docs.components.schemas.PageResponseCollectionCardResponseDto.properties
        .totalElements,
)
assert.ok(docs.components.schemas.CertificateViewDto.properties.issuedAt)

// 이력 응답은 페이지라 content 로 감싸여 있다
assert.ok(
    docs.components.schemas.PageResponseEditionGenerationResponseDto
        .properties.content,
)

// 사진은 파일이라 multipart 로 보낸다
assert.ok(
    docs.paths['/memories'].post.requestBody.content['multipart/form-data'],
)

// AI 분석 응답의 다듬은 사연을 선택하면 실제 에디션 생성에도 그 문장을 사용한다
assert.ok(docs.components.schemas.MemoryResponseDto.properties.storyRefined)
assert.ok(
    docs.paths['/memories/{memoryId}/story-source'].patch.requestBody.content[
        'application/json'
    ],
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

// 한 회차의 열린 콘셉트는 가운데에 놓고, 준비되지 않은 콘셉트는 선택하지 않는다
const concepts = [
    { conceptId: 1, displayOrder: 1, status: 'IMAGE_READY', isUnlocked: true },
    { conceptId: 2, displayOrder: 2, status: 'IMAGE_READY', isUnlocked: false },
    { conceptId: 3, displayOrder: 3, status: 'FAILED', isUnlocked: false },
]

assert.deepEqual(
    arrangeConcepts(concepts).map(({ conceptId }) => conceptId),
    [2, 1, 3],
)
assert.equal(
    isSelectable({ status: 'PENDING', isUnlocked: true }),
    false,
)

// 보증서 category 는 대분류가 아니라 세부 카테고리로 내려올 수 있다
for (const category of ['가방', '핸드백', '토트백', '백팩', '클러치', '트래블']) {
    assert.equal(bucketOf(category), 'bag')
}

for (const category of ['악세사리', '액세서리', '벨트', '스카프', '지갑', '키링', '헤어밴드']) {
    assert.equal(bucketOf(category), 'accessory')
}

for (const category of ['의류', '니트', '가디건', '셔츠', '자켓', '원피스', '후드티', '블라우스', '팬츠']) {
    assert.equal(bucketOf(category), 'clothing')
}

console.log('Edition generation API contract check passed')

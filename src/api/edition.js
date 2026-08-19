import { api } from './client'

// 추억 등록 — 사진이 섞여 있어 multipart 다. 폼에는 dataURL 로 들어 있으니 Blob 으로 되돌린다
export const createMemory = async ({ image, ...fields }) => {
    const body = new FormData()

    if (image) {
        const blob = await fetch(image).then((res) => res.blob())

        // 확장자로 형식을 보는 서버가 있다 — 원본 파일명은 dataURL 로 바뀌며 이미 사라졌으니 MIME 에서 만든다
        const extension = (blob.type.split('/')[1] || 'jpg').split('+')[0]

        body.append('photo', blob, `memory.${extension}`)
    }

    // 빈 값은 아예 빼야 서버 검증에 걸리지 않는다
    Object.entries(fields).forEach(([key, value]) => {
        if (value) body.append(key, value)
    })

    return api('/memories', {
        method: 'POST',
        auth: true,
        body,
    })
}

// AI 분석(Stage 1). 이걸 거치지 않은 추억은 에디션을 생성할 수 없다
export const analyzeMemory = (memoryId) =>
    api(`/memories/${memoryId}/analyze`, {
        method: 'POST',
        auth: true,
    })

// 에디션 생성에 원문과 AI로 다듬은 사연 중 무엇을 쓸지 고른다
export const selectStorySource = (memoryId, useRefinedStory) =>
    api(`/memories/${memoryId}/story-source`, {
        method: 'PATCH',
        auth: true,
        body: {
            useRefinedStory,
        },
    })

// 접수만 하고 즉시 응답한다 — 콘셉트 3장은 모두 PENDING 이고 imageUrl 은 null
export const requestEditionGeneration = (memoryId, body) =>
    api(`/memories/${memoryId}/edition-generations`, {
        method: 'POST',
        auth: true,
        body,
    })

// 추억 하나의 생성 회차 이력. 콘셉트 화면이 이걸로 지금까지의 회차를 되살린다
export const getEditionGenerations = (memoryId, { page = 0, size = 50 } = {}) =>
    api(
        `/memories/${memoryId}/edition-generations?${new URLSearchParams({
            page,
            size,
        })}`,
        {
            auth: true,
        },
    )

// AI 후보 중 하나를 고르거나 직접 지은 이름으로 바꾼다 (50자 이내)
export const selectEditionName = (generationId, editionName) =>
    api(`/edition-generations/${generationId}/edition-name`, {
        method: 'PATCH',
        auth: true,
        body: {
            editionName,
        },
    })

export const getEditionGeneration = (generationId) =>
    api(`/edition-generations/${generationId}`, {
        auth: true,
    })

// 크레딧을 차감하고 잠긴 콘셉트를 연다. 잔액이 모자라면 서버가 거절한다
export const unlockConcept = (conceptId) =>
    api(`/edition-concepts/${conceptId}/unlock`, {
        method: 'POST',
        auth: true,
    })

const POLL_INTERVAL = 2000
const POLL_TIMEOUT = 180000
const MAX_CONSECUTIVE_ERRORS = 3

// 이미지 생성은 뒤에서 비동기로 돈다 — 3장이 다 PENDING 을 벗어날 때까지 폴링한다.
// isCancelled 는 화면을 떠났을 때 폴링을 멈추려고 받는다
export async function pollEditionGeneration(generationId, isCancelled) {
    const deadline = Date.now() + POLL_TIMEOUT
    let failures = 0

    while (!isCancelled()) {
        let generation = null

        try {
            generation = await getEditionGeneration(generationId)
            failures = 0
        } catch (caught) {
            // 순단 한 번에 폴링을 끊으면 사용자가 재시도를 누르게 되고, 그게 회차 재결제로 이어진다
            failures += 1

            if (failures >= MAX_CONSECUTIVE_ERRORS) {
                throw caught
            }
        }

        // 아직 3장이 붙기 전일 수 있다 — 빈 배열을 '전부 실패' 로 읽지 않는다
        if (generation?.concepts?.length) {
            const pending = generation.concepts.some(
                (concept) => concept.status === 'PENDING',
            )

            if (!pending) {
                if (
                    generation.concepts.every(
                        (concept) => concept.status === 'FAILED',
                    )
                ) {
                    const failed = new Error(
                        '콘셉트 생성에 실패했습니다. 다시 시도해주세요.',
                    )

                    // 이 회차는 끝났다 — 재시도가 같은 id 를 다시 붙들면 영영 못 빠져나온다
                    failed.generationDead = true

                    throw failed
                }

                return generation
            }
        }

        if (Date.now() > deadline) {
            throw new Error(
                '생성이 예상보다 오래 걸립니다. 잠시 후 다시 시도해주세요.',
            )
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    return null
}

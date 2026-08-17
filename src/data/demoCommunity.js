// 운영 DB에 공개 카드가 아직 0건이라 커뮤니티가 텅 빈 화면으로 뜬다.
// 백엔드가 빈 배열을 주는 동안만 이 가상 데이터로 채운다 — 내 컬렉션 목업(editions)을 그대로 쓴다.
// ponytail: 실제 공개 카드가 생기면 이 파일과 CommunityPage·CollectionPage 의 demo 분기를 지운다
import { editions } from './editions'

export const DEMO_PERSON = {
    userId: 0,
    nickname: '구름빵',
    profileImageUrl: '',
    shareToken: 'demo',
}

const CATEGORY_LABEL = {
    clothing: '의류',
    bag: '가방',
    accessory: '악세사리',
}

// 모양은 EditionFeedItemResponseDto 와 같게 맞춘다 — 화면 코드가 분기를 안 타도록
export const DEMO_EDITIONS = editions.map((edition) => ({
    conceptId: edition.id,
    imageUrl: edition.images.transparent,
    editionName: edition.name,
    editionNumber: edition.number,
    category: CATEGORY_LABEL[edition.mainCategory],
    ownerId: DEMO_PERSON.userId,
    ownerNickname: DEMO_PERSON.nickname,
    likeCount: edition.likes,
    createdAt: edition.createdAt,
}))

// 가상 데이터도 검색은 실제처럼 걸러야 한다 — 없는 닉네임으로 찾으면 결과가 없어야 맞다
export function demoSearch(keyword) {
    const query = keyword.trim().toLowerCase()
    if (!query) return { editions: DEMO_EDITIONS, people: [DEMO_PERSON] }

    return {
        editions: DEMO_EDITIONS.filter(
            (edition) =>
                edition.editionName.toLowerCase().includes(query) ||
                edition.ownerNickname.toLowerCase().includes(query),
        ),
        people: DEMO_PERSON.nickname.toLowerCase().includes(query) ? [DEMO_PERSON] : [],
    }
}

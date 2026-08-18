import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import SectionHeading from './components/SectionHeading'
import OwnerHeading from './components/OwnerHeading'
import EditionCard from './components/EditionCard'
import { getCommunityEditions, getPublicCollections } from '../../api/community'
import { searchUsers } from '../../api/user'
import { demoSearch } from '../../data/demoCommunity'

const toCard = (edition) => ({
  id: edition.conceptId,
  title: edition.editionName,
  subtitle: `${edition.category} · ${edition.ownerNickname}`,
  likes: edition.likeCount,
  image: edition.imageUrl,
})

export default function CommunityPage() {
  const [editions, setEditions] = useState([])
  const [people, setPeople] = useState([])
  const [query, setQuery] = useState('')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    // 피드 keyword 는 에디션명·닉네임을 함께 본다. 사람 목록은 검색할 때만 필요하다
    Promise.all([
      getCommunityEditions({ keyword }),
      keyword ? getPublicCollections({ nickname: keyword }) : null,
      keyword ? searchUsers(keyword) : [],
    ])
      .then(([page, collections, users]) => {
        if (cancelled) return

        // 회원 검색은 옷장을 공개하지 않은 사람도 찾아준다. shareToken 은 공개한 사람에게만 붙고,
        // 회원 검색에 안 잡힌 공개 옷장 주인도 놓치지 않게 뒤에 이어 붙인다
        const owners = collections?.content ?? []
        const found = [
          ...users.map((user) => ({
            ...user,
            shareToken: owners.find((owner) => owner.userId === user.userId)?.shareToken,
          })),
          ...owners.filter((owner) => !users.some((user) => user.userId === owner.userId)),
        ]

        // 백엔드에 공개 카드가 하나도 없으면 가상 데이터로 채운다
        const demo =
          !page.content?.length && !found.length
            ? demoSearch(keyword)
            : { editions: [], people: [] }
        setEditions(page.content?.length ? page.content : demo.editions)
        setPeople(found.length ? found : demo.people)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [keyword])

  // 닉네임이 맞은 사람은 카드를 그 사람 컬렉션으로 묶고, 남은 카드는 에디션명이 맞은 것들이다
  const searchSections = [
    ...people.map(({ userId, nickname, profileImageUrl, shareToken }) => ({
      id: `owner-${userId}`,
      owner: { nickname, profileImageUrl },
      // 옷장을 공개하지 않은 회원은 열어볼 진열장이 없어 링크를 안 붙인다
      href: shareToken && `/community/collection/${shareToken}`,
      items: editions.filter((edition) => edition.ownerNickname === nickname).map(toCard),
    })),
    {
      id: 'editions',
      eyebrow: 'EDITIONS',
      title: '에디션 검색 결과',
      items: editions
        .filter((edition) => !people.some((person) => person.nickname === edition.ownerNickname))
        .map(toCard),
    },
  ].filter((section) => section.id !== 'editions' || section.items.length > 0)

  // ponytail: 운영 API의 sort 파라미터가 Pageable과 충돌해 500을 내므로,
  // 백엔드가 파라미터를 분리할 때까지 받아온 최신 100개 안에서 인기순을 계산한다.
  const feedSections = [
    {
      id: 'popular',
      eyebrow: 'POPULAR',
      title: '인기 에디션',
      items: [...editions]
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 4)
        .map(toCard),
    },
    {
      id: 'latest',
      eyebrow: 'LATEST',
      title: '최신 에디션',
      items: editions.slice(0, 4).map(toCard),
    },
  ].filter((section) => section.items.length > 0)

  const sections = keyword ? searchSections : feedSections

  return (
    // Header 를 main 밖에 둔다 — main 안의 <header> 는 banner 랜드마크로 안 잡힌다
    <>
      <Header />
      <main className="min-h-[100dvh] w-full">
        {/* 캔버스 1280 안에서 좌우 48 을 뺀 1184 가 콘텐츠 폭이다 */}
        <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
          {/* 크림 패널 없이 우드 배경 위에 바로 올린다 — 우드(#a87f64)는 중간톤이라
              그 위 텍스트는 ink 계열이 아니면 4.5:1 을 못 넘는다 */}
          <div className="flex flex-col gap-[16px]">
            {/* 검색 상자는 제목 블록 바닥에 맞춘다 (items-end) */}
            <div className="flex items-end justify-between gap-[24px] max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-[16px]">
              <div className="min-w-0">
                <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
                  공개 컬렉션 커뮤니티
                </h1>
                <p className="mt-[10px] mb-0 text-[13.5px] break-keep text-ink">
                  다른 사용자의 에디션을 둘러보세요.
                </p>
              </div>

              <form
                className="flex h-[42px] w-[246px] shrink-0 items-center gap-[8px] border border-[#dcd3c5] bg-white pr-[13px] pl-[13px] focus-within:border-clay max-[860px]:w-full"
                onSubmit={(event) => {
                  event.preventDefault()
                  setKeyword(query.trim())
                }}
              >
                <label className="sr-only" htmlFor="edition-search">
                  에디션 · 닉네임 검색
                </label>
                <svg
                  className="size-[14px] shrink-0 text-ink/40"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  <circle cx="6" cy="6" r="4.4" />
                  <path d="M9.3 9.3 12.6 12.6" strokeLinecap="round" />
                </svg>
                <input
                  className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 text-[12.5px] text-ink outline-0 placeholder:text-ink/40"
                  id="edition-search"
                  name="q"
                  type="search"
                  placeholder="에디션 · 닉네임 검색"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button className="sr-only" type="submit">검색</button>
              </form>
            </div>

            {loading && <p className="m-0 py-[36px] text-center text-[12px] text-ink">불러오는 중입니다.</p>}
            {error && <p className="m-0 py-[36px] text-center text-[12px] font-medium text-ink" role="alert">{error}</p>}
            {!loading && !error && sections.length === 0 && (
              <p className="m-0 py-[36px] text-center text-[12px] text-ink">
                {keyword ? '검색 결과가 없습니다.' : '아직 공개된 에디션이 없습니다.'}
              </p>
            )}

            {!loading && !error && sections.map(({ id, eyebrow, title, owner, href, items }) => (
              <section key={id} aria-labelledby={`${id}-heading`}>
                {owner ? (
                  <OwnerHeading id={`${id}-heading`} href={href} {...owner} />
                ) : (
                  <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} />
                )}
                {items.length === 0 ? (
                  <p className="m-0 py-[20px] text-[12px] text-ink">공개된 카드가 없습니다.</p>
                ) : (
                  <ul className="mt-[16px] grid list-none grid-cols-4 gap-x-[32px] gap-y-[30px] p-0 max-[1100px]:grid-cols-3 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
                    {items.map((item) => (
                      <li key={item.id}>
                        <EditionCard {...item} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

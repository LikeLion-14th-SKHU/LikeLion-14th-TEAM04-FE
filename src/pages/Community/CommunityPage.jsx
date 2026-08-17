import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import SectionHeading from './components/SectionHeading'
import EditionCard from './components/EditionCard'
import { getCommunityEditions } from '../../api/community'

const toCard = (edition) => ({
  id: edition.conceptId,
  title: edition.editionName,
  subtitle: `${edition.category} · ${edition.ownerNickname}`,
  likes: edition.likeCount,
  image: edition.imageUrl,
})

export default function CommunityPage() {
  const [editions, setEditions] = useState([])
  const [query, setQuery] = useState('')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    getCommunityEditions({ keyword })
      .then((page) => {
        if (!cancelled) setEditions(page.content ?? [])
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

  // ponytail: 운영 API의 sort 파라미터가 Pageable과 충돌해 500을 내므로,
  // 백엔드가 파라미터를 분리할 때까지 받아온 최신 100개 안에서 인기순을 계산한다.
  const sections = [
    {
      id: 'popular',
      eyebrow: 'POPULAR',
      title: '인기 에디션',
      items: [...editions]
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 3)
        .map(toCard),
    },
    {
      id: 'latest',
      eyebrow: 'LATEST',
      title: '최신 에디션',
      items: editions.slice(0, 3).map(toCard),
    },
  ]

  return (
    // Header 를 main 밖에 둔다 — main 안의 <header> 는 banner 랜드마크로 안 잡힌다
    <>
      <Header />
      <main className="min-h-[100dvh] w-full">
        {/* 캔버스 1280 안에서 좌우 48 을 뺀 1184 가 콘텐츠 폭이다 */}
        <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
          <Panel className="flex flex-col gap-[16px]">
            {/* 검색 상자는 제목 블록 바닥에 맞춘다 (items-end) */}
            <div className="flex items-end justify-between gap-[24px] max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-[16px]">
              <div className="min-w-0">
                <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
                  공개 컬렉션 커뮤니티
                </h1>
                <p className="mt-[10px] mb-0 text-[13.5px] break-keep text-ink/62">
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

            {loading && <p className="m-0 py-[36px] text-center text-[12px] text-muted">불러오는 중입니다.</p>}
            {error && <p className="m-0 py-[36px] text-center text-[12px] text-cognac" role="alert">{error}</p>}
            {!loading && !error && editions.length === 0 && (
              <p className="m-0 py-[36px] text-center text-[12px] text-muted">
                {keyword ? '검색 결과가 없습니다.' : '아직 공개된 에디션이 없습니다.'}
              </p>
            )}

            {!loading && !error && editions.length > 0 && sections.map(({ id, eyebrow, title, items }) => (
              <section key={id} aria-labelledby={`${id}-heading`}>
                <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} />
                <ul className="mt-[16px] grid list-none grid-cols-3 gap-[20px] p-0 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      <EditionCard {...item} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </Panel>
        </div>
      </main>
    </>
  )
}

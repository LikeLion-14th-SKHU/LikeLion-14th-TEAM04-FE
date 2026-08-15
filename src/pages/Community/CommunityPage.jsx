import Header from '../../components/Header'
import Panel from '../../components/Panel'
import SectionHeading from './components/SectionHeading'
import EditionCard from './components/EditionCard'

import { editions } from '../../data/editions'

// 카드에서 상세로 넘어가야 해서 실제 에디션 데이터로 만든다 — 더미 목록은
// 상세에 없는 에디션이라 눌러도 "찾을 수 없습니다" 로 떨어졌다.
// TODO: 공개 에디션 목록 API 연동 (지금은 앞의 3개씩)
const toCard = (edition) => ({
  id: edition.id,
  title: edition.name,
  subtitle: `${edition.material} · ${edition.subCategory}`,
  likes: edition.likes,
  image: edition.images.transparent,
})

const SECTIONS = [
  {
    id: 'popular',
    eyebrow: 'POPULAR',
    title: '인기 에디션',
    items: [...editions]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3)
      .map(toCard),
  },
  {
    id: 'latest',
    eyebrow: 'LATEST',
    title: '최신 에디션',
    items: [...editions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(toCard),
  },
]

export default function CommunityPage() {
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

              {/* 시각적으로는 placeholder 만 보이지만 라벨은 남긴다.
                  검색 API 가 없어 제출 동작은 아직 없다. TODO: 검색 API 연동 */}
              <search className="flex h-[42px] w-[246px] shrink-0 items-center gap-[8px] border border-[#dcd3c5] bg-white pr-[13px] pl-[13px] focus-within:border-clay max-[860px]:w-full">
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
                />
              </search>
            </div>

            {SECTIONS.map(({ id, eyebrow, title, items }) => (
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

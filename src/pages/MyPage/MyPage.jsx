import { useState } from 'react'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import CreditTopUpModal from './components/CreditTopUpModal'

// 계정 API 가 아직 없어 더미로 둔다. TODO: 내 계정 조회 API 연동
const ACCOUNT_ROWS = [
  { label: '이름', value: '김석환' },
  { label: '이메일', value: 'seokhwan@example.com' },
  { label: '비밀번호', value: '최근 변경 2026.07.12' },
  { label: '기본 배송지', value: '서울특별시 ···' },
]

const NOTIFICATIONS = [
  { id: 'edition', label: '에디션 생성 완료' },
  { id: 'like', label: '커뮤니티 좋아요' },
  { id: 'news', label: '혜택 · 소식' },
]

const ORDERS = [
  {
    id: 'MA-20260804-0012',
    product: '아카이브 파우치',
    status: '제작 상담 중',
    statusClass: 'bg-[#f4ede2] text-[#6b4e38]',
  },
  {
    id: 'MA-20260718-0007',
    product: '모노그램 파우치',
    status: '배송 완료',
    statusClass: 'bg-[#ede7da] text-ink/60',
  },
]

export default function MyPage() {
  const [credit, setCredit] = useState(12500)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const [notify, setNotify] = useState({ edition: true, like: true, news: false })

  return (
    // Header 를 main 밖에 둔다 — main 안의 <header> 는 banner 랜드마크로 안 잡힌다
    <>
      <Header />
      <main className="min-h-[100dvh] w-full">
        {/* 캔버스 1280 안에서 좌우 48 을 뺀 1184 가 콘텐츠 폭이다 */}
        <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
          <Panel>
            <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
              마이페이지
            </h1>
            <p className="mt-[10px] mb-[24px] text-[13.5px] break-keep text-ink/62">
              프로필, 계정 설정과 주문 내역을 관리하세요.
            </p>

            <section
              className="flex h-[100px] items-center border border-frame bg-white px-[24px] max-[860px]:h-auto max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-[18px] max-[860px]:py-[20px]"
              aria-label="프로필"
            >
              {/* 프로필 사진 API 가 없어 빈 원으로 둔다. TODO: 프로필 이미지 연동 */}
              <span
                className="size-[72px] shrink-0 rounded-full border border-[rgba(23,18,14,.12)] bg-[#d9d9d9]"
                aria-hidden="true"
              />
              <div className="ml-[22px] min-w-0 max-[860px]:ml-0">
                <p className="m-0 flex items-center gap-[9px] text-[18px] font-semibold">
                  김석환
                  <span className="inline-flex h-[19px] items-center bg-[#f4ede2] px-[9px] text-[8.5px] tracking-[.12em] text-[#6b4e38]">
                    공개
                  </span>
                </p>
                <p className="mt-[7px] mb-0 text-[12.5px] break-all text-ink/55">
                  seokhwan@example.com
                </p>
              </div>

              <div className="ml-auto flex items-center gap-[26px] max-[860px]:ml-0 max-[860px]:w-full max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-[16px]">
                <div className="text-right max-[860px]:text-left">
                  <p className="m-0 text-[8.5px] tracking-[.18em] text-ink/50">보유 크레딧</p>
                  <p className="mt-[15px] mb-0 text-[28px]">{credit.toLocaleString('ko-KR')} C</p>
                </div>
                <div className="flex gap-[9px] max-[860px]:flex-col">
                  <Button onClick={() => setTopUpOpen(true)}>충전</Button>
                  {/* 편집 화면이 아직 없어 동작은 비워둔다. TODO: 프로필 편집 라우트 연결 */}
                  <Button variant="secondary">프로필 편집</Button>
                </div>
              </div>
            </section>

            <div className="mt-[20px] grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">
              <section className="border border-frame bg-white p-[22px]" aria-labelledby="account-heading">
                <h2 className="m-0 text-[13.5px] font-medium" id="account-heading">
                  계정 설정
                </h2>
                <ul className="mt-[6px] list-none p-0">
                  {ACCOUNT_ROWS.map(({ label, value }) => (
                    <li
                      key={label}
                      className="flex h-[44px] items-center gap-[12px] border-b border-[#f2ebe0]"
                    >
                      <span className="w-[110px] shrink-0 text-[12.5px] text-ink/55">{label}</span>
                      <span className="flex-1 truncate text-[12.5px]">{value}</span>
                      {/* 수정 화면이 아직 없어 동작은 비워둔다. TODO: 계정 항목 수정 연결 */}
                      <button
                        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] transition-colors duration-700 ease-film hover:text-ink"
                        type="button"
                        // 버튼 4개의 이름이 전부 "수정" 이 되지 않게 항목 이름을 붙인다
                        aria-label={`${label} 수정`}
                      >
                        수정
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border border-frame bg-white p-[22px]" aria-labelledby="notify-heading">
                <h2 className="m-0 text-[13.5px] font-medium" id="notify-heading">
                  알림 설정
                </h2>
                <div className="mt-[16px] flex flex-col gap-[16px]">
                  {NOTIFICATIONS.map(({ id, label }) => (
                    // 체크박스를 숨겨서 쓴다 — 클릭·스페이스·스크린리더 상태를 브라우저가 해준다
                    <label
                      key={id}
                      className="flex h-[20px] cursor-pointer items-center justify-between gap-[12px]"
                    >
                      <span className="text-[12.5px] text-ink/70">{label}</span>
                      <input
                        className="peer sr-only"
                        type="checkbox"
                        checked={notify[id]}
                        onChange={(event) =>
                          setNotify({ ...notify, [id]: event.target.checked })
                        }
                      />
                      {/* 손잡이는 ::after 로 그린다 — 38 - 3 - 14 - 3 = 18 만큼 오른쪽으로 민다 */}
                      <span className="relative h-[20px] w-[38px] shrink-0 rounded-full bg-[#dcd3c5] transition-colors duration-700 ease-film after:absolute after:top-[3px] after:left-[3px] after:size-[14px] after:rounded-full after:bg-white after:transition-transform after:duration-700 after:ease-film peer-checked:bg-ink peer-checked:after:translate-x-[18px] peer-checked:after:bg-[#f7f1e8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay" />
                    </label>
                  ))}
                </div>
                <p className="mt-[16px] mb-0 text-[11px] leading-[19px] break-keep text-ink/45">
                  알림은 이메일로 발송되며 언제든 해제할 수 있습니다.
                </p>
              </section>
            </div>

            <section
              className="mt-[20px] border border-frame bg-white p-[22px]"
              aria-labelledby="orders-heading"
            >
              <div className="flex items-center justify-between gap-[16px]">
                <h2 className="m-0 text-[13.5px] font-medium" id="orders-heading">
                  최근 주문
                </h2>
                {/* 주문 목록 화면이 아직 없어 동작은 비워둔다. TODO: 주문 목록 라우트 연결 */}
                <button
                  className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] transition-colors duration-700 ease-film hover:text-ink"
                  type="button"
                >
                  전체 주문 보기 →
                </button>
              </div>
              <ul className="mt-[6px] list-none p-0">
                {ORDERS.map(({ id, product, status, statusClass }) => (
                  <li
                    key={id}
                    className="flex h-[44px] items-center gap-[12px] border-b border-[#f2ebe0] max-[860px]:h-auto max-[860px]:flex-wrap max-[860px]:py-[12px]"
                  >
                    <span className="w-[220px] shrink-0 text-[11.5px] max-[860px]:w-full">{id}</span>
                    <span className="flex-1 truncate text-[12.5px] max-[860px]:flex-none">
                      {product}
                    </span>
                    <span
                      className={`flex h-[24px] shrink-0 items-center px-[11px] text-[11.5px] ${statusClass}`}
                    >
                      {status}
                    </span>
                    {/* 주문 상세 화면이 아직 없어 동작은 비워둔다. TODO: 주문 상세 라우트 연결 */}
                    <button
                      className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] transition-colors duration-700 ease-film hover:text-ink max-[860px]:ml-auto"
                      type="button"
                      aria-label={`주문 ${id} 상세 보기`}
                    >
                      상세 보기
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </Panel>
        </div>
      </main>

      <CreditTopUpModal
        open={topUpOpen}
        credit={credit}
        // 결제 API 가 없어 화면 상태만 올린다. TODO: 크레딧 충전 API 연동
        onTopUp={(amount) => setCredit(credit + amount)}
        onClose={() => setTopUpOpen(false)}
      />
    </>
  )
}

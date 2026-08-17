import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import InputModal from '../../components/InputModal'
import CreditTopUpModal from './components/CreditTopUpModal'
import ConfirmModal from '../../components/ConfirmModal'
import {
  getMe,
  updateMe,
  updateProfileImage,
  deleteMe,
} from '../../api/user'

const NOTIFICATIONS = [
  { id: 'edition', label: '에디션 생성 완료' },
  { id: 'like', label: '커뮤니티 좋아요' },
  { id: 'news', label: '혜택 · 소식' },
]

// 주문 API는 아직 없으므로 화면용 더미 데이터
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
  const navigate = useNavigate()
  const profileInputRef = useRef(null)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unauthorized, setUnauthorized] = useState(false)

  // 실제 서버 credit을 초기값으로 사용
  // 충전 자체는 API가 없어 화면에서만 증가
  const [credit, setCredit] = useState(0)
  const [topUpOpen, setTopUpOpen] = useState(false)

  // 공통 입력 모달
  const [editModal, setEditModal] = useState(null)

  const [withdrawOpen, setWithdrawOpen] = useState(false)

  // 알림 설정은 API가 없어 화면 상태만 유지
  const [notify, setNotify] = useState({
    edition: true,
    like: true,
    news: false,
  })

  // -------------------------
  // 내 정보 조회
  // GET /me
  // -------------------------
  useEffect(() => {
    let cancelled = false

    const fetchMe = async () => {
      try {
        setLoading(true)
        setError('')
        setUnauthorized(false)

        const data = await getMe()

        if (cancelled) return

        setUser(data)
        setCredit(data?.credit ?? 0)
      } catch (err) {
        if (cancelled) return

        console.error('내 정보 조회 실패:', err)

        if (err.status === 401) {
          setUnauthorized(true)
          setUser(null)
          setError('')
        } else {
          setError('회원 정보를 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMe()

    return () => {
      cancelled = true
    }
  }, [])

  // -------------------------
  // 로그아웃
  // -------------------------
  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate('/')
  }

  // -------------------------
  // 이름 수정 모달 열기
  // -------------------------
  const openNicknameModal = () => {
    setEditModal({
      type: 'nickname',
      title: '이름 수정',
      description: '새로운 이름을 입력해주세요.',
      defaultValue: user?.nickname ?? '',
      placeholder: '이름 입력',
      confirmText: '수정',
    })
  }

  // -------------------------
  // 배송지 입력 모달 열기
  // -------------------------
  const openAddressModal = () => {
    setEditModal({
      type: 'address',
      title: '기본 배송지 입력',
      description: '상품을 받을 기본 배송지를 입력해주세요.',
      defaultValue: '',
      placeholder: '배송지 입력',
      confirmText: '저장',
    })
  }

  // -------------------------
  // 공통 입력 모달 확인
  // -------------------------
  const handleEditConfirm = async (value) => {
    if (!editModal) return

    // 이름 수정
    if (editModal.type === 'nickname') {
      try {
        const updatedUser = await updateMe(value)

        setUser(updatedUser)

        if (updatedUser?.credit !== undefined) {
          setCredit(updatedUser.credit)
        }

        setEditModal(null)
      } catch (err) {
        console.error('이름 수정 실패:', err)

        if (err.status === 401) {
          setUser(null)
          setUnauthorized(true)
          setEditModal(null)
          return
        }

        alert(err.message ?? '이름 수정에 실패했습니다.')
      }

      return
    }

    // 배송지 저장 API는 아직 없음
    if (editModal.type === 'address') {
      alert('배송지 저장 기능은 아직 지원하지 않습니다.')
      setEditModal(null)
    }
  }

  // -------------------------
  // 프로필 이미지 수정
  // PATCH /me/profile-image
  // -------------------------
  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택할 수 있습니다.')
      event.target.value = ''
      return
    }

    try {
      const updatedUser = await updateProfileImage(file)

      setUser(updatedUser)

      if (updatedUser?.credit !== undefined) {
        setCredit(updatedUser.credit)
      }
    } catch (err) {
      console.error('프로필 이미지 수정 실패:', err)

      if (err.status === 401) {
        setUser(null)
        setUnauthorized(true)
        return
      }

      alert(err.message ?? '프로필 이미지 수정에 실패했습니다.')
    } finally {
      event.target.value = ''
    }
  }

  // -------------------------
  // 회원 탈퇴
  // DELETE /me
  // -------------------------
  const handleWithdraw = async () => {
    try {
      await deleteMe()

      localStorage.clear()
      sessionStorage.clear()

      setWithdrawOpen(false)
      navigate('/')
    } catch (err) {
      console.error('회원 탈퇴 실패:', err)

      if (err.status === 401) {
        setUser(null)
        setUnauthorized(true)
        setWithdrawOpen(false)
        return
      }

      alert(err.message ?? '회원 탈퇴에 실패했습니다.')
    }
  }

  const accountRows = [
    {
      label: '이름',
      value: user?.nickname ?? '-',
      action: '수정',
      onClick: openNicknameModal,
    },
    {
      label: '이메일',
      value: user?.email ?? '-',
      action: null,
      onClick: null,
    },
    {
      label: '비밀번호',
      value: '변경 기능을 지원하지 않습니다.',
      action: null,
      onClick: null,
    },
    {
      label: '기본 배송지',
      value: '입력된 배송지가 없습니다.',
      action: '입력',
      onClick: openAddressModal,
    },
  ]

  return (
    <>
      <Header />

      <main className="min-h-[100dvh] w-full">
        <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
          <Panel>
            <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
              마이페이지
            </h1>

            <p className="mt-[10px] mb-[24px] text-[13.5px] break-keep text-ink/62">
              프로필, 계정 설정과 주문 내역을 관리하세요.
            </p>

            {/* 로딩 */}
            {loading && (
              <p className="m-0 py-[56px] text-center text-[12px] text-muted">
                회원 정보를 불러오는 중입니다.
              </p>
            )}

            {/* 비로그인 */}
            {!loading && unauthorized && (
              <section
                className="flex min-h-[300px] flex-col items-center justify-center border border-frame bg-white px-[24px] py-[56px] text-center"
                aria-labelledby="login-required-heading"
              >
                <div className="flex size-[54px] items-center justify-center rounded-full bg-[#f4ede2]">
                  <svg
                    className="size-[22px] text-ink/60"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path
                      d="M4.5 21c.7-4.3 3.2-6.5 7.5-6.5s6.8 2.2 7.5 6.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h2
                  className="mt-[18px] mb-0 text-[18px] font-semibold"
                  id="login-required-heading"
                >
                  로그인이 필요한 페이지입니다.
                </h2>

                <p className="mt-[10px] mb-0 text-[12.5px] leading-[20px] break-keep text-ink/55">
                  로그인하거나 회원가입 후
                  <br />
                  마이페이지를 이용해보세요.
                </p>

                <div className="mt-[24px]">
                  <Button onClick={() => navigate('/login')}>
                    로그인 / 회원가입 하러가기
                  </Button>
                </div>
              </section>
            )}

            {/* 일반 서버 오류 */}
            {!loading && !unauthorized && error && (
              <div
                className="flex min-h-[220px] flex-col items-center justify-center border border-frame bg-white px-[24px] text-center"
                role="alert"
              >
                <p className="m-0 text-[13px] text-cognac">
                  {error}
                </p>

                <button
                  className="mt-[14px] cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] underline"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  다시 시도
                </button>
              </div>
            )}

            {/* 로그인 + 회원 정보 조회 성공 */}
            {!loading && !error && !unauthorized && user && (
              <>
                {/* 프로필 */}
                <section
                  className="flex h-[100px] items-center border border-frame bg-white px-[24px] max-[860px]:h-auto max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-[18px] max-[860px]:py-[20px]"
                  aria-label="프로필"
                >
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={`${user.nickname} 프로필`}
                      className="size-[72px] shrink-0 rounded-full border border-[rgba(23,18,14,.12)] object-cover"
                    />
                  ) : (
                    <span
                      className="size-[72px] shrink-0 rounded-full border border-[rgba(23,18,14,.12)] bg-[#d9d9d9]"
                      aria-hidden="true"
                    />
                  )}

                  <div className="ml-[22px] min-w-0 max-[860px]:ml-0">
                    <p className="m-0 flex items-center gap-[9px] text-[18px] font-semibold">
                      {user.nickname}

                      <button
                        className="cursor-pointer border border-[rgba(23,18,14,.22)] bg-transparent px-[10px] py-[3px] text-[11px] font-normal text-ink/60 transition-colors duration-700 ease-film hover:bg-white hover:text-ink"
                        type="button"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </button>
                    </p>

                    <p className="mt-[7px] mb-0 text-[12.5px] break-all text-ink/55">
                      {user.email}
                    </p>
                  </div>

                  <div className="ml-auto flex items-center gap-[26px] max-[860px]:ml-0 max-[860px]:w-full max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-[16px]">
                    <div className="text-right max-[860px]:text-left">
                      <p className="m-0 text-[8.5px] tracking-[.18em] text-ink/50">
                        보유 크레딧
                      </p>

                      <p className="mt-[15px] mb-0 text-[28px]">
                        {credit.toLocaleString('ko-KR')} C
                      </p>
                    </div>

                    <div className="flex gap-[9px] max-[860px]:flex-col">
                      {/* 충전은 화면에서만 동작 */}
                      <Button onClick={() => setTopUpOpen(true)}>
                        충전
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => profileInputRef.current?.click()}
                      >
                        프로필 사진 변경
                      </Button>

                      <input
                        ref={profileInputRef}
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                    </div>
                  </div>
                </section>

                <div className="mt-[20px] grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">
                  {/* 계정 설정 */}
                  <section
                    className="border border-frame bg-white p-[22px]"
                    aria-labelledby="account-heading"
                  >
                    <h2
                      className="m-0 text-[13.5px] font-medium"
                      id="account-heading"
                    >
                      계정 설정
                    </h2>

                    <ul className="mt-[6px] list-none p-0">
                      {accountRows.map(
                        ({ label, value, action, onClick }) => (
                          <li
                            key={label}
                            className="flex h-[44px] items-center gap-[12px] border-b border-[#f2ebe0]"
                          >
                            <span className="w-[110px] shrink-0 text-[12.5px] text-ink/55">
                              {label}
                            </span>

                            <span className="flex-1 truncate text-[12.5px]">
                              {value}
                            </span>

                            {action && (
                              <button
                                className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] transition-colors duration-700 ease-film hover:text-ink"
                                type="button"
                                onClick={onClick}
                                aria-label={`${label} ${action}`}
                              >
                                {action}
                              </button>
                            )}
                          </li>
                        ),
                      )}
                    </ul>

                    <div className="mt-[18px] flex items-center justify-end gap-[12px]">
                      <button
                        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] text-ink/45 underline transition-colors duration-700 ease-film hover:text-[#8c3b33]"
                        type="button"
                        onClick={() => setWithdrawOpen(true)}
                      >
                        회원 탈퇴
                      </button>
                    </div>
                  </section>

                  {/* 알림 설정 - UI 전용 */}
                  <section
                    className="border border-frame bg-white p-[22px]"
                    aria-labelledby="notify-heading"
                  >
                    <h2
                      className="m-0 text-[13.5px] font-medium"
                      id="notify-heading"
                    >
                      알림 설정
                    </h2>

                    <div className="mt-[16px] flex flex-col gap-[16px]">
                      {NOTIFICATIONS.map(({ id, label }) => (
                        <label
                          key={id}
                          className="flex h-[20px] cursor-pointer items-center justify-between gap-[12px]"
                        >
                          <span className="text-[12.5px] text-ink/70">
                            {label}
                          </span>

                          <input
                            className="peer sr-only"
                            type="checkbox"
                            checked={notify[id]}
                            onChange={(event) =>
                              setNotify({
                                ...notify,
                                [id]: event.target.checked,
                              })
                            }
                          />

                          <span className="relative h-[20px] w-[38px] shrink-0 rounded-full bg-[#dcd3c5] transition-colors duration-700 ease-film after:absolute after:top-[3px] after:left-[3px] after:size-[14px] after:rounded-full after:bg-white after:transition-transform after:duration-700 after:ease-film peer-checked:bg-ink peer-checked:after:translate-x-[18px] peer-checked:after:bg-[#f7f1e8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay" />
                        </label>
                      ))}
                    </div>

                    <p className="mt-[16px] mb-0 text-[11px] leading-[19px] break-keep text-ink/45">
                      알림은 이메일로 발송되며 언제든 해제할 수 있습니다.
                    </p>
                  </section>
                </div>

                {/* 최근 주문 - UI 전용 */}
                <section
                  className="mt-[20px] border border-frame bg-white p-[22px]"
                  aria-labelledby="orders-heading"
                >
                  <div className="flex items-center justify-between gap-[16px]">
                    <h2
                      className="m-0 text-[13.5px] font-medium"
                      id="orders-heading"
                    >
                      최근 주문
                    </h2>

                    <button
                      className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] transition-colors duration-700 ease-film hover:text-ink"
                      type="button"
                    >
                      전체 주문 보기 →
                    </button>
                  </div>

                  <ul className="mt-[6px] list-none p-0">
                    {ORDERS.map(
                      ({ id, product, status, statusClass }) => (
                        <li
                          key={id}
                          className="flex h-[44px] items-center gap-[12px] border-b border-[#f2ebe0] max-[860px]:h-auto max-[860px]:flex-wrap max-[860px]:py-[12px]"
                        >
                          <span className="w-[220px] shrink-0 text-[11.5px] max-[860px]:w-full">
                            {id}
                          </span>

                          <span className="flex-1 truncate text-[12.5px] max-[860px]:flex-none">
                            {product}
                          </span>

                          <span
                            className={`flex h-[24px] shrink-0 items-center px-[11px] text-[11.5px] ${statusClass}`}
                          >
                            {status}
                          </span>

                          <button
                            className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] transition-colors duration-700 ease-film hover:text-ink max-[860px]:ml-auto"
                            type="button"
                            aria-label={`주문 ${id} 상세 보기`}
                          >
                            상세 보기
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                </section>
              </>
            )}
          </Panel>
        </div>
      </main>

      {/* 크레딧 충전 - 실제 API 없음 */}
      <CreditTopUpModal
        open={topUpOpen}
        credit={credit}
        onTopUp={(amount) =>
          setCredit((currentCredit) => currentCredit + amount)
        }
        onClose={() => setTopUpOpen(false)}
      />

      {/* 이름 / 배송지 공통 입력 모달 */}
      <InputModal
        open={Boolean(editModal)}
        title={editModal?.title}
        description={editModal?.description}
        defaultValue={editModal?.defaultValue}
        placeholder={editModal?.placeholder}
        confirmText={editModal?.confirmText}
        onClose={() => setEditModal(null)}
        onConfirm={handleEditConfirm}
      />
      <ConfirmModal
        open={withdrawOpen}
        title="회원 탈퇴"
        description="회원 탈퇴 시 모든 에디션과 컬렉션이 삭제되며 되돌릴 수 없습니다. 정말 탈퇴하시겠습니까?"
        confirmText="탈퇴하기"
        cancelText="취소"
        onConfirm={handleWithdraw}
        onClose={() => setWithdrawOpen(false)}
      />
    </>
  )
}
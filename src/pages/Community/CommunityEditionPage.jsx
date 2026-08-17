import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import {
  getCommunityEdition,
  getLikeStatus,
  likeEdition,
  unlikeEdition,
} from '../../api/community'

export default function CommunityEditionPage() {
  const { conceptId } = useParams()
  const [edition, setEdition] = useState(null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [likePending, setLikePending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getCommunityEdition(conceptId), getLikeStatus(conceptId)])
      .then(([detail, status]) => {
        if (cancelled) return
        setEdition({ ...detail, likeCount: status.likeCount })
        setLiked(status.likedByMe)
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
  }, [conceptId])

  const handleLike = async () => {
    setLikePending(true)
    setError('')
    try {
      await (liked ? unlikeEdition(conceptId) : likeEdition(conceptId))
      const status = await getLikeStatus(conceptId)
      setLiked(status.likedByMe)
      setEdition((current) => ({ ...current, likeCount: status.likeCount }))
    } catch (err) {
      setError(err.status === 401 ? '로그인 후 좋아요를 누를 수 있습니다.' : err.message)
    } finally {
      setLikePending(false)
    }
  }

  const certificate = edition?.certificate

  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-56px)] px-[24px] py-[48px]">
        <Panel className="mx-auto w-full max-w-[960px]">
          <Link className="text-[11px] text-muted underline underline-offset-4" to="/community">
            ← 커뮤니티로 돌아가기
          </Link>

          {loading && <p className="py-[56px] text-center text-[12px] text-muted">불러오는 중입니다.</p>}
          {!loading && !edition && <p className="py-[56px] text-center text-[12px] text-cognac" role="alert">{error}</p>}

          {edition && (
            <div className="mt-[24px] grid grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-[42px] max-[820px]:grid-cols-1">
              <div className="flex min-h-[390px] items-center justify-center border border-frame bg-white p-[14px]">
                <img
                  className="max-h-[360px] w-full object-contain"
                  src={edition.gridImageUrl || edition.imageUrl}
                  alt={certificate?.editionName ?? '공개 에디션'}
                />
              </div>

              <div>
                <p className="m-0 text-[9px] tracking-[.18em] text-clay">PUBLIC EDITION</p>
                <h1 className="mt-[12px] mb-0 font-brand text-[30px] font-normal">
                  {certificate?.editionName}
                </h1>
                <p className="mt-[8px] mb-0 text-[11px] text-muted">
                  {certificate?.editionNumber} · {certificate?.category} · {edition.ownerNickname}
                </p>

                <p className="mt-[26px] mb-0 text-[12px] leading-[1.9] text-ink/65">
                  {certificate?.certificateText || certificate?.story}
                </p>

                <button
                  className="mt-[24px] cursor-pointer border border-frame bg-white px-[16px] py-[10px] text-[11px] text-clay disabled:cursor-default disabled:opacity-50"
                  type="button"
                  aria-pressed={liked}
                  disabled={likePending}
                  onClick={handleLike}
                >
                  {liked ? '♥' : '♡'} 좋아요 {edition.likeCount}개
                </button>
                {error && <p className="mt-[10px] mb-0 text-[11px] text-cognac" role="alert">{error}</p>}
              </div>
            </div>
          )}
        </Panel>
      </main>
    </>
  )
}

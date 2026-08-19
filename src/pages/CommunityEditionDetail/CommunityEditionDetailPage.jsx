import { useState } from 'react'
import { useParams } from 'react-router'

import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'

import { editions } from '../../data/editions'

export default function CommunityEditionDetailPage() {
    const { editionId, userId } = useParams()

    const edition = editions.find(
        (item) => item.id === Number(editionId),
    )

    // TODO: 공개 프로필 API 연동
    const owner = {
        id: userId,
        nickname: '닉네임',
        profileImage: '',
        editionCount: 8,
        storyCount: 8,
    }

    const [likes, setLikes] = useState(
        edition?.likes ?? 0,
    )

    const [liked, setLiked] = useState(false)

    if (!edition) {
        return (
            <>
                <Header />

                <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-[24px]">
                    <Panel className="w-full max-w-[520px] py-[56px] text-center">
                        <p className="text-[13px] text-ink/50">
                            에디션을 찾을 수 없습니다.
                        </p>
                    </Panel>
                </main>
            </>
        )
    }

    const handleLike = () => {
        setLiked((prev) => !prev)

        setLikes((prev) =>
            liked ? prev - 1 : prev + 1,
        )
    }

    const handleShare = async () => {
        const shareData = {
            title: `${edition.name} | Memory Atelier`,
            text: `${edition.name} 에디션을 확인해보세요.`,
            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
                return
            }

            await navigator.clipboard.writeText(
                window.location.href,
            )

            alert('에디션 링크가 복사되었습니다.')
        } catch {
            // 공유 창을 닫은 경우
        }
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-56px)] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[58px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[36px]">
                    <Panel>
                        <div className="border-b border-[#ded4c7] pb-[14px]">
                            <h1 className="m-0 text-[30px] font-semibold tracking-[-.04em]">
                                {edition.name}
                            </h1>
                        </div>

                        <section className="mt-[28px]">
                            <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-[42px] max-[900px]:grid-cols-1">
                                <div>
                                    <div className="border border-frame bg-white p-[14px]">
                                        <div className="flex h-[390px] items-center justify-center bg-[#d4c2a6]">
                                            {edition.images?.image2d ? (
                                                <img
                                                    src={edition.images.image2d}
                                                    alt={edition.name}
                                                    className="h-[90%] w-[90%] object-contain"
                                                />
                                            ) : (
                                                <span className="text-[8px] tracking-[.12em] text-ink/35">
                                                    2D 굿즈 이미지
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLike}
                                        className="mt-[12px] flex cursor-pointer items-center gap-[7px] border-0 bg-transparent p-0 text-[10px] text-ink/55"
                                    >
                                        <span>
                                            {liked ? '♥' : '♡'}
                                        </span>

                                        좋아요 {likes}개
                                    </button>

                                    <div className="mt-[20px] flex items-center justify-between border border-frame bg-white px-[16px] py-[13px]">
                                        <div className="flex min-w-0 items-center gap-[11px]">
                                            {owner.profileImage ? (
                                                <img
                                                    src={owner.profileImage}
                                                    alt={owner.nickname}
                                                    className="size-[40px] shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="size-[40px] shrink-0 rounded-full border border-[#d2cac0] bg-[#dedede]" />
                                            )}

                                            <div className="min-w-0">
                                                <p className="m-0 truncate text-[11px] font-medium">
                                                    {owner.nickname}
                                                </p>

                                                <p className="mt-[3px] mb-0 text-[7px] tracking-[.1em] text-ink/35">
                                                    EDITIONS {owner.editionCount}
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="secondary"
                                            href={`/users/${owner.id}/collection`}
                                            className="h-[34px] shrink-0 px-[12px] text-[9px]"
                                        >
                                            컬렉션 보러가기
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="m-0 font-brand text-[24px] font-normal">
                                        Edition No. {edition.number} ·{' '}
                                        {edition.name}
                                    </h2>

                                    <div className="mt-[24px]">
                                        <p className="m-0 text-[10px] font-medium">
                                            생성 날짜
                                        </p>

                                        <p className="mt-[5px] mb-0 text-[10px] text-ink/50">
                                            {edition.createdAt}
                                        </p>
                                    </div>

                                    <div className="mt-[22px]">
                                        <p className="m-0 text-[10px] font-medium">
                                            추억 스토리
                                        </p>

                                        <p className="mt-[8px] mb-0 text-[11.5px] leading-[1.8] text-ink/65">
                                            {edition.story}
                                        </p>
                                    </div>

                                    <div className="mt-[24px] flex gap-[10px]">
                                        <Button
                                            variant="secondary"
                                            onClick={handleLike}
                                            className="h-[38px] px-[16px]"
                                        >
                                            {liked ? '♥' : '♡'} 좋아요
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            onClick={handleShare}
                                            className="h-[38px] px-[16px]"
                                        >
                                            ↗ 공유
                                        </Button>
                                    </div>

                                    <p className="mt-[18px] mb-0 text-[9px] text-ink/35">
                                        공개된 에디션만 조회할 수 있으며,
                                        보증서는 소유자에게만 표시됩니다.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </Panel>
                </div>
            </main>
        </>
    )
}
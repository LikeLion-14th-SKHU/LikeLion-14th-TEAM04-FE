import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'

const MATERIALS = [
    '데님',
    '가죽',
    '니트',
    '울',
    '면',
    '린넨',
    '벨벳',
    '레이스',
    '선택안함',
]

const CLOTHING_CATEGORIES = {
    top: {
        label: '상의',
        subCategories: [
            '선택안함',
            '티셔츠',
            '셔츠',
            '블라우스',
            '니트',
            '맨투맨',
            '후드티',
        ],
    },

    bottom: {
        label: '하의',
        subCategories: [
            '선택안함',
            '청바지',
            '슬랙스',
            '반바지',
            '스커트',
            '트레이닝팬츠',
        ],
    },

    dress: {
        label: '원피스',
        subCategories: [
            '선택안함',
            '미니원피스',
            '미디원피스',
            '롱원피스',
            '점프수트',
        ],
    },

    outer: {
        label: '아우터',
        subCategories: [
            '선택안함',
            '자켓',
            '코트',
            '패딩',
            '가디건',
            '바람막이',
        ],
    },
}

const PRODUCT_CATEGORIES = {
    clothing: {
        label: '의류',
        subCategories: [
            '선택안함',
            '니트',
            '가디건',
            '셔츠',
            '자켓',
            '원피스',
            '후드티',
            '블라우스',
            '팬츠',
        ],
    },

    bag: {
        label: '가방',
        subCategories: [
            '선택안함',
            '핸드백',
            '토트백',
            '백팩',
            '클러치',
            '트래블',
        ],
    },

    accessory: {
        label: '악세사리',
        subCategories: [
            '선택안함',
            '벨트',
            '스카프',
            '지갑',
            '키링',
            '헤어밴드',
        ],
    },
}

const EMPTY_FORM = {
    image: '',
    story: '',
    material: '',
    materialCustom: '',
    clothingMain: '',
    clothingSub: '',
    clothingSubCustom: '',
    mainCategory: '',
    subCategory: '',
}

export default function EditionCreatePage() {
    const navigate = useNavigate()

    const [form, setForm] = useState(() => {
        const saved = sessionStorage.getItem('edition-form')

        return saved ? JSON.parse(saved) : EMPTY_FORM
    })

    const [polishing, setPolishing] = useState(false)
    const [guideChecked, setGuideChecked] = useState(false)

    useEffect(() => {
        sessionStorage.setItem('edition-form', JSON.stringify(form))
    }, [form])

    const updateForm = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]

        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {
            updateForm('image', reader.result)
        }

        reader.readAsDataURL(file)
    }

    const handlePolishStory = () => {
        if (!form.story.trim()) return

        setPolishing(true)

        // TODO: 실제 AI 문장 다듬기 API 연결
        setTimeout(() => {
            const cleaned = form.story.trim().replace(/\s+/g, ' ')

            updateForm(
                'story',
                cleaned.includes('기억')
                    ? cleaned
                    : `${cleaned} 오랫동안 간직하고 싶은 기억이 담긴 옷입니다.`,
            )

            setPolishing(false)
        }, 700)
    }

    const subCategories = form.mainCategory
        ? PRODUCT_CATEGORIES[form.mainCategory].subCategories
        : []

    const clothingSubCategories = form.clothingMain
        ? CLOTHING_CATEGORIES[form.clothingMain].subCategories
        : []

    const materialCompleted =
        form.material &&
        (form.material !== '직접입력' || form.materialCustom.trim())

    const clothingCompleted =
        form.clothingMain &&
        form.clothingSub &&
        (form.clothingSub !== '직접입력' || form.clothingSubCustom.trim())

    const canContinue =
        form.image &&
        form.story.trim() &&
        materialCompleted &&
        clothingCompleted &&
        form.mainCategory &&
        form.subCategory &&
        guideChecked

    const getIncompleteMessage = () => {
        if (!form.image) {
            return '옷 사진 업로드를 완료해주세요.'
        }

        if (!form.story.trim()) {
            return '한 줄 사연 입력을 완료해주세요.'
        }

        if (!form.material) {
            return '재질 선택을 완료해주세요.'
        }

        if (
            form.material === '직접입력' &&
            !form.materialCustom.trim()
        ) {
            return '재질 직접 입력을 완료해주세요.'
        }

        if (!form.clothingMain) {
            return '의류 메인 종류 선택을 완료해주세요.'
        }

        if (!form.clothingSub) {
            return '의류 세부 종류 선택을 완료해주세요.'
        }

        if (
            form.clothingSub === '직접입력' &&
            !form.clothingSubCustom.trim()
        ) {
            return '의류 세부 종류 직접 입력을 완료해주세요.'
        }

        if (!form.mainCategory) {
            return '굿즈 메인 카테고리 선택을 완료해주세요.'
        }

        if (!form.subCategory) {
            return '굿즈 세부 카테고리 선택을 완료해주세요.'
        }

        if (!guideChecked) {
            return '안내 내용 확인을 완료해주세요.'
        }

        return ''
    }

    const incompleteMessage = getIncompleteMessage()

    const handleNext = () => {
        if (!canContinue) return

        sessionStorage.setItem('edition-form', JSON.stringify(form))

        navigate('/edition/create/generating')
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-56px)] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[38px] pb-[38px] max-[860px]:px-[22px]">
                    <Panel>
                        <div className="flex items-center gap-[12px]">
                            <span className="text-[8px] tracking-[.22em] text-clay">
                                STEP 01 / 03
                            </span>

                            <span className="h-px w-[52px] bg-ink" />
                            <span className="h-px w-[44px] bg-[#d8cec0]" />
                            <span className="h-px w-[44px] bg-[#d8cec0]" />
                        </div>

                        <h1 className="mt-[16px] mb-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em]">
                            추억 입력
                        </h1>

                        <p className="mt-[10px] mb-0 text-[12.5px] leading-[1.7] text-ink/55">
                            버리지 못한 옷의 사진과 이야기를 입력하면 AI가 특별한
                            에디션으로 재창조합니다.
                        </p>

                        <div className="mt-[28px] grid grid-cols-2 gap-[22px] max-[860px]:grid-cols-1">
                            {/* 왼쪽 */}
                            <div className="flex flex-col gap-[16px]">
                                <section className="border border-frame bg-white p-[18px]">
                                    <div className="flex items-center justify-between gap-[16px]">
                                        <h2 className="m-0 text-[13px] font-medium">
                                            옷 사진 업로드
                                        </h2>

                                        <label className="flex h-[32px] cursor-pointer items-center border border-[#d9cdbd] px-[12px] text-[10px] transition-colors duration-700 ease-film hover:bg-paper">
                                            사진 선택

                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                className="sr-only"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>

                                    <label className="mt-[14px] flex h-[235px] cursor-pointer items-center justify-center border border-dashed border-[#d5c7b5] bg-[#fcf9f4]">
                                        {form.image ? (
                                            <img
                                                src={form.image}
                                                alt="업로드한 옷"
                                                className="h-full w-full object-contain p-[12px]"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <div className="mx-auto flex size-[34px] items-center justify-center border border-ink/40 text-[16px]">
                                                    ◇
                                                </div>

                                                <p className="mt-[12px] mb-0 text-[9px] tracking-[.08em] text-ink/40">
                                                    원본 옷 사진 · JPG / PNG
                                                </p>

                                                <p className="mt-[7px] mb-0 text-[10px] text-ink/45">
                                                    이 영역에 사진을 끌어다 놓으세요
                                                </p>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            className="sr-only"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </section>

                                <section className="border border-frame bg-white p-[18px]">
                                    <div className="flex items-center justify-between gap-[12px]">
                                        <div>
                                            <h2 className="m-0 text-[13px] font-medium">
                                                한 줄 사연
                                            </h2>

                                            <p className="mt-[5px] mb-0 text-[9.5px] text-ink/45">
                                                그 옷에 담긴 추억을 적어주세요.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={!form.story.trim() || polishing}
                                            onClick={handlePolishStory}
                                            className="h-[31px] cursor-pointer border border-[#b99b7c] bg-[#f7f0e7] px-[11px] text-[9px] text-clay transition-colors duration-700 ease-film hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {polishing ? '다듬는 중...' : 'AI로 다듬기'}
                                        </button>
                                    </div>

                                    <textarea
                                        value={form.story}
                                        maxLength={500}
                                        onChange={(event) =>
                                            updateForm('story', event.target.value)
                                        }
                                        placeholder="할머니께서 생일 선물로 사주신 원피스예요. 함께 여행 갔던 날의 추억이 가장 많이 담겨 있습니다."
                                        className="mt-[12px] h-[118px] w-full resize-none border border-[#ddd1c1] bg-[#fcfaf6] p-[12px] text-[11.5px] leading-[1.7] text-ink outline-none transition-colors focus:border-clay"
                                    />

                                    <p className="mt-[5px] mb-0 text-right text-[8px] text-ink/35">
                                        {form.story.length} / 500
                                    </p>
                                </section>
                            </div>

                            {/* 오른쪽 */}
                            <div className="flex flex-col gap-[14px]">
                                <p className="m-0 text-[10px] font-medium">
                                    추억 옷 정보 입력
                                </p>

                                <section className="border border-frame bg-white p-[18px]">
                                    <h2 className="m-0 text-[12.5px] font-medium">
                                        재질
                                    </h2>

                                    <div className="mt-[12px] flex flex-wrap gap-[8px]">
                                        {MATERIALS.map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => updateForm('material', item)}
                                                className={`h-[32px] cursor-pointer border px-[14px] text-[10px] transition-colors duration-700 ease-film ${form.material === item
                                                    ? 'border-ink bg-ink text-cream'
                                                    : 'border-[#ddd1c1] bg-white text-ink/65 hover:border-clay'
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => updateForm('material', '직접입력')}
                                            className={`h-[32px] cursor-pointer border px-[14px] text-[10px] ${form.material === '직접입력'
                                                ? 'border-ink bg-ink text-cream'
                                                : 'border-[#ddd1c1] bg-white text-ink/65'
                                                }`}
                                        >
                                            직접 입력
                                        </button>
                                    </div>

                                    {form.material === '직접입력' && (
                                        <input
                                            value={form.materialCustom}
                                            onChange={(event) =>
                                                updateForm('materialCustom', event.target.value)
                                            }
                                            placeholder="재질을 입력해주세요"
                                            className="mt-[10px] h-[38px] w-full border border-[#ddd1c1] px-[12px] text-[10.5px] outline-none focus:border-clay"
                                        />
                                    )}
                                </section>

                                <section className="border border-frame bg-white p-[18px]">
                                    <h2 className="m-0 text-[12.5px] font-medium">
                                        의류 메인 종류
                                    </h2>

                                    <div className="mt-[12px] grid grid-cols-4 gap-[8px]">
                                        {Object.entries(CLOTHING_CATEGORIES).map(
                                            ([value, category]) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            clothingMain: value,
                                                            clothingSub: '',
                                                            clothingSubCustom: '',
                                                        }))
                                                    }
                                                    className={`h-[36px] cursor-pointer border text-[10px] transition-colors duration-700 ease-film ${form.clothingMain === value
                                                        ? 'border-ink bg-ink text-cream'
                                                        : 'border-[#ddd1c1] bg-white text-ink/65 hover:border-clay'
                                                        }`}
                                                >
                                                    {category.label}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </section>

                                <section className="border border-frame bg-white p-[18px]">
                                    <h2 className="m-0 text-[12.5px] font-medium">
                                        의류 세부 종류
                                    </h2>

                                    {form.clothingMain ? (
                                        <div className="mt-[12px] flex flex-wrap gap-[8px]">
                                            {clothingSubCategories.map((item) => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() =>
                                                        updateForm('clothingSub', item)
                                                    }
                                                    className={`h-[32px] cursor-pointer border px-[13px] text-[10px] transition-colors duration-700 ease-film ${form.clothingSub === item
                                                        ? 'border-ink bg-ink text-cream'
                                                        : 'border-[#ddd1c1] bg-white text-ink/65 hover:border-clay'
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateForm('clothingSub', '직접입력')
                                                }
                                                className={`h-[32px] cursor-pointer border px-[13px] text-[10px] ${form.clothingSub === '직접입력'
                                                    ? 'border-ink bg-ink text-cream'
                                                    : 'border-[#ddd1c1] bg-white text-ink/65'
                                                    }`}
                                            >
                                                직접 입력
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="mt-[12px] mb-0 text-[10px] text-ink/40">
                                            먼저 의류 메인 종류를 선택해주세요.
                                        </p>
                                    )}

                                    {form.clothingSub === '직접입력' && (
                                        <input
                                            value={form.clothingSubCustom}
                                            onChange={(event) =>
                                                updateForm(
                                                    'clothingSubCustom',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="의류 종류를 입력해주세요"
                                            className="mt-[10px] h-[38px] w-full border border-[#ddd1c1] px-[12px] text-[10.5px] outline-none focus:border-clay"
                                        />
                                    )}
                                </section>

                                <p className="mt-[2px] mb-0 text-[10px] font-medium">
                                    생성할 에디션 정보 입력
                                </p>

                                <section className="border border-frame bg-white p-[18px]">
                                    <h2 className="m-0 text-[12.5px] font-medium">
                                        굿즈 메인 카테고리
                                    </h2>

                                    <div className="mt-[12px] grid grid-cols-3 gap-[8px]">
                                        {Object.entries(PRODUCT_CATEGORIES).map(
                                            ([value, category]) => (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    onClick={() =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            mainCategory: value,
                                                            subCategory: '',
                                                        }))
                                                    }
                                                    className={`h-[36px] cursor-pointer border text-[10px] transition-colors duration-700 ease-film ${form.mainCategory === value
                                                        ? 'border-ink bg-ink text-cream'
                                                        : 'border-[#ddd1c1] bg-white text-ink/65 hover:border-clay'
                                                        }`}
                                                >
                                                    {category.label}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </section>

                                <section className="border border-frame bg-white p-[18px]">
                                    <h2 className="m-0 text-[12.5px] font-medium">
                                        굿즈 세부 카테고리
                                    </h2>

                                    {form.mainCategory ? (
                                        <div className="mt-[12px] flex flex-wrap gap-[8px]">
                                            {subCategories.map((item) => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    onClick={() =>
                                                        updateForm('subCategory', item)
                                                    }
                                                    className={`h-[32px] cursor-pointer border px-[13px] text-[10px] transition-colors duration-700 ease-film ${form.subCategory === item
                                                        ? 'border-ink bg-ink text-cream'
                                                        : 'border-[#ddd1c1] bg-white text-ink/65 hover:border-clay'
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-[12px] mb-0 text-[10px] text-ink/40">
                                            먼저 메인 카테고리를 선택해주세요.
                                        </p>
                                    )}
                                </section>
                            </div>
                        </div>

                        {/* 하단 안내 */}
                        <div className="mt-[22px] border-t border-[#ddd1c1] pt-[18px]">
                            <div className="mt-[22px] border-t border-[#ddd1c1] pt-[18px]">
                                <div className="flex items-end justify-between gap-[24px] max-[760px]:flex-col max-[760px]:items-stretch">
                                    <div>
                                        <p className="m-0 max-w-[820px] text-[9px] leading-[1.7] text-ink/45">
                                            업로드한 사진과 사연은 옷의 색감 · 패턴 · 질감 분석 및
                                            에디션 생성에만 사용됩니다. 생성된 에디션은 기본적으로
                                            비공개이며, 공개 설정 시에만 커뮤니티에 노출됩니다.
                                        </p>

                                        <label className="mt-[14px] flex cursor-pointer items-center gap-[8px]">
                                            <input
                                                type="checkbox"
                                                checked={guideChecked}
                                                onChange={(event) =>
                                                    setGuideChecked(event.target.checked)
                                                }
                                                className="size-[14px] accent-[#18130f]"
                                            />

                                            <span className="text-[10px]">
                                                안내 내용을 확인했습니다.
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-[14px] max-[760px]:justify-end">
                                        {!canContinue && (
                                            <p className="m-0 text-[10px] font-medium text-clay">
                                                {incompleteMessage}
                                            </p>
                                        )}

                                        <Button
                                            disabled={!canContinue}
                                            onClick={handleNext}
                                            className="min-w-[76px]"
                                        >
                                            다음
                                        </Button>
                                    </div>
                                </div>
                            </div>                    </div>
                    </Panel>
                </div>
            </main>
        </>
    )
}
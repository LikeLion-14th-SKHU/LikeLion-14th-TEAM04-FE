import Button from '../../components/Button'
import OrderLayout from './components/OrderLayout'
import Card from './components/Card'
import SummaryRows from './components/SummaryRows'

// 견적 API 가 아직 없어 더미로 둔다. TODO: 견적 조회 API 연동
const QUOTE_ROWS = [
  { label: '굿즈 카테고리', value: '레더 토트백' },
  { label: '에디션명', value: 'Heritage Moment Vol.1' },
  { label: '소재 등급', value: '프리미엄 풀그레인 레더' },
  { label: '수량', value: '1개' },
  { label: '제작 기간', value: '약 4~6주' },
  { label: '배송비', value: '실비 별도' },
]

const INCLUDED = [
  'Memory Atelier 헤리티지 레더 소재 적용',
  '에디션 전용 금속 로고 각인',
  '디지털 컬러리 보증서 포함',
  '전용 Memory Atelier 패키징 박스 제공',
  '1:1 제작 담당자 커뮤니케이션',
]

const NOTICES = [
  '아래 견적은 선택한 굿즈 카테고리와 에디션 정보를 바탕으로 산출된 예상 제작 비용입니다.',
  '견적 승인 후 주문서 작성 단계로 이동하며, 최종 금액은 주문서 확정 시 확정됩니다.',
  '실물 제작물은 3D 콘셉트 이미지와 소재·색감에서 차이가 있을 수 있습니다.',
]

export default function QuotePage() {
  return (
    <OrderLayout
      title="제작 상담·견적 확인"
      description="산출된 예상 제작 비용을 확인하고 주문서 작성으로 넘어가세요."
      steps={['1 상담 요청', '2 견적 확인', '3 주문서 작성', '4 결제']}
      current={1}
    >
      <Card id="notice-heading" title="실물 제작 상담 안내">
        <ul className="mt-[16px] mb-0 flex list-disc flex-col gap-[10px] pl-[18px]">
          {NOTICES.map((notice) => (
            <li key={notice} className="text-[12.5px] leading-[20px] break-keep text-ink/62">
              {notice}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-[20px] grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">
        <div className="flex flex-col gap-[20px]">
          <Card id="quote-heading" title="견적 요약">
            <SummaryRows className="mt-[6px]" rows={QUOTE_ROWS} />
          </Card>

          <Card id="included-heading" title="포함 항목">
            <ul className="mt-[16px] mb-0 flex list-disc flex-col gap-[10px] pl-[18px]">
              {INCLUDED.map((item) => (
                <li key={item} className="text-[12.5px] leading-[20px] break-keep text-ink/70">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card id="total-heading" title="최종 견적 금액">
          <p className="mt-[16px] mb-0 text-[30px] leading-[1.2] font-semibold tracking-[-.03em]">
            ₩ 1,280,000
          </p>
          <p className="mt-[10px] mb-0 text-[11.5px] text-ink/55">VAT 포함 금액 · 배송비 별도</p>
          <p className="mt-[18px] mb-0 border-t border-[#f0e8dc] pt-[16px] text-[11.5px] break-keep text-ink/50">
            견적 유효 기간: 2026년 8월 18일까지
          </p>
          <div className="mt-[22px] flex flex-col gap-[10px]">
            <Button href="/order/form">견적 승인 및 주문서 작성</Button>
            <Button variant="secondary" href="/order">
              실물 굿즈 구매로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    </OrderLayout>
  )
}

import Button from '../../components/Button'
import OrderLayout from './components/OrderLayout'
import Card from './components/Card'
import Steps from './components/Steps'
import SummaryRows from './components/SummaryRows'

// 주문 API 가 아직 없어 더미로 둔다. TODO: 주문 상품·견적 조회 API 연동
const PRICE_ROWS = [
  { label: '기본 제작비', value: '₩ 1,200,000' },
  { label: '옵션 추가', value: '₩ 80,000' },
  { label: '합계 (부가세 포함)', value: '견적 확인 후 확정', strong: true },
]

const PROGRESS = ['제작 상담', '견적 확인', '주문 확정', '결제', '제작·배송']

const GUIDE_STEPS = ['제작 상담 신청 및 옵션 선택', '견적 검토 및 확인', '주문 확정 후 결제 진행']

export default function OrderPage() {
  return (
    <OrderLayout
      title="실물 에디션 구매"
      description="제작 상담을 신청하고 견적을 확인한 뒤 실물 굿즈를 주문하세요."
    >
      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">
        <div className="flex flex-col gap-[20px]">
          <Card id="goods-heading" title="주문 상품 요약">
            <div className="mt-[16px] flex gap-[20px] max-[640px]:flex-col">
              {/* 굿즈 렌더 이미지가 아직 없어 자리만 잡아둔다. TODO: 굿즈 콘셉트 이미지 연동 */}
              <p className="m-0 flex h-[112px] w-[330px] shrink-0 items-center justify-center bg-[#f2ede5] text-[11px] text-ink/40 max-[640px]:w-full">
                굿즈 콘셉트 이미지
              </p>
              <dl className="m-0 flex min-w-0 flex-1 flex-col gap-[16px]">
                <div>
                  <dt className="text-[11.5px] text-ink/50">에디션명</dt>
                  <dd className="mt-[7px] text-[15px] font-medium">Heritage Moment Vol.1</dd>
                </div>
                <div>
                  <dt className="text-[11.5px] text-ink/50">카테고리</dt>
                  <dd className="mt-[7px]">
                    <span className="inline-flex h-[24px] items-center bg-[#f4ede2] px-[11px] text-[11.5px] text-[#6b4e38]">
                      가방
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            <p className="mt-[18px] mb-0 border-t border-[#f0e8dc] pt-[16px] text-[12.5px] break-keep text-ink/55">
              프리미엄 풀그레인 레더 · 클래식 브라운
            </p>
          </Card>

          <Card id="price-heading" title="예상 금액">
            <SummaryRows className="mt-[6px]" rows={PRICE_ROWS} />
          </Card>

          <Card id="progress-heading" title="주문 진행 현황">
            <Steps className="mt-[16px]" steps={PROGRESS} current={0} />
            <p className="mt-[16px] mb-0 text-[11.5px] leading-[20px] break-keep text-ink/50">
              현재 제작 상담 단계입니다. 견적을 확인한 뒤 주문을 확정해 주세요.
            </p>
          </Card>
        </div>

        <Card id="guide-heading" title="제작 상담·견적 안내">
          <p className="mt-[14px] mb-0 text-[12px] leading-[20px] break-keep text-ink/62">
            Memory Atelier 장인 제작 방식으로 귀하의 추억을 실물 럭셔리 굿즈로 제작합니다.
          </p>
          <ol className="mt-[18px] mb-0 flex list-none flex-col gap-[12px] p-0">
            {GUIDE_STEPS.map((step, index) => (
              <li key={step} className="flex gap-[10px] text-[12px] break-keep text-ink/70">
                {/* 번호는 ol 이 이미 순서를 알려주므로 화면 표시용으로만 둔다 */}
                <span className="shrink-0 text-clay" aria-hidden="true">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-[22px] flex flex-col gap-[10px]">
            {/* 라우터가 없어 이동은 전체 새로고침이다 (App.jsx 의 ROUTES 스위치) */}
            <Button href="/order/quote">제작 상담·견적 확인</Button>
            <Button variant="secondary" href="/community">
              에디션 상세로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    </OrderLayout>
  )
}

import Button from '../../components/Button'
import OrderLayout from './components/OrderLayout'
import Card from './components/Card'
import SummaryRows from './components/SummaryRows'

// 주문 결과 API 가 아직 없어 더미로 둔다. TODO: 주문 상세 조회 API 연동
const ORDER_ROWS = [
  { label: '주문번호', value: 'MA-20260804-0012' },
  { label: '주문 날짜', value: '2026.08.04' },
  { label: '예상 배송', value: '제작 완료 후 약 4~6주' },
]

const PAYMENT_ROWS = [
  { label: '상품 금액', value: '₩ 1,280,000' },
  { label: '배송료', value: '별도' },
  { label: '총 결제액', value: '₩ 1,280,000', strong: true },
]

export default function OrderCompletePage() {
  return (
    <OrderLayout
      title="주문이 완료되었습니다"
      description="주문 내역과 결제 정보를 확인하세요."
    >
      <div className="flex flex-col gap-[20px]">
        <Card id="confirm-heading" title="주문 확인">
          {/* 전체 폭 카드라 폭을 묶지 않으면 라벨과 값이 화면 양 끝으로 갈라진다 */}
          <SummaryRows className="mt-[6px] max-w-[560px]" rows={ORDER_ROWS} />
        </Card>

        <Card id="product-heading" title="주문 상품">
          <div className="mt-[16px] flex items-center gap-[20px] max-[640px]:flex-col max-[640px]:items-start">
            {/* 굿즈 렌더 이미지가 아직 없어 자리만 잡아둔다. TODO: 제품 이미지 연동 */}
            <p className="m-0 flex h-[84px] w-[500px] shrink-0 items-center justify-center bg-[#f2ede5] text-[11px] text-ink/40 max-[860px]:w-[320px] max-[640px]:w-full">
              제품 이미지
            </p>
            <div className="min-w-0">
              <p className="m-0 text-[15px] font-medium break-keep">Heritage Moment Vol.1</p>
              <p className="mt-[7px] mb-0 text-[12.5px] break-keep text-ink/55">
                레더 토트백 · 클래식 브라운
              </p>
              <p className="mt-[7px] mb-0 text-[12.5px] text-ink/55">수량: 1개</p>
            </div>
          </div>
        </Card>

        <Card id="payment-heading" title="결제 정보">
          <SummaryRows className="mt-[6px] max-w-[560px]" rows={PAYMENT_ROWS} />
        </Card>

        <div>
          <h2 className="m-0 text-[13.5px] font-medium">다음 단계</h2>
          <p className="mt-[10px] mb-0 text-[12.5px] leading-[20px] break-keep text-ink/62">
            주문 접수가 완료되었습니다. 곧 제작을 시작하며, 진행 상황은 주문·배송 현황에서 확인할 수
            있습니다.
          </p>
        </div>

        <div className="flex gap-[10px] max-[640px]:flex-col">
          <Button variant="secondary" href="/community">
            갤러리로
          </Button>
          <Button href="/mypage">주문·배송 현황</Button>
          {/* 영수증 화면이 아직 없어 동작은 비워둔다. TODO: 영수증 보기 연결 */}
          <Button variant="secondary">영수증 보기</Button>
        </div>
      </div>
    </OrderLayout>
  )
}

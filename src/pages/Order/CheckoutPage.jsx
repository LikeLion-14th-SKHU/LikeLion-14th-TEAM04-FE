import { useState } from 'react'
import Button from '../../components/Button'
import OrderLayout from './components/OrderLayout'
import Card from './components/Card'
import Field, { INPUT_CLASS } from './components/Field'
import CheckboxRow from './components/CheckboxRow'
import SummaryRows from './components/SummaryRows'

// 결제 API 가 아직 없어 더미로 둔다. 주문서에서 고른 수량은 여기 반영되지 않는다 —
// 화면 사이로 값을 나르지 않고 주문 조회 API 가 붙을 때 서버 값으로 채운다.
// TODO: 주문 금액·결제 API 연동 (수량·금액을 서버에서 받아 오기)
const AMOUNT_ROWS = [
  { label: '상품 금액', value: '₩ 1,280,000' },
  { label: '배송비', value: '결제 시 계산' },
  { label: '할인 금액', value: '—' },
  { label: '최종 결제 금액', value: '₩ 1,280,000', strong: true },
]

const RECEIVER_FIELDS = [
  { id: 'receiver-name', label: '수령인 이름', name: 'name', autoComplete: 'name' },
  { id: 'receiver-tel', label: '연락처', name: 'tel', type: 'tel', autoComplete: 'tel' },
  { id: 'receiver-email', label: '이메일', name: 'email', type: 'email', autoComplete: 'email' },
]

export default function CheckoutPage() {
  // 입력값은 아직 어디로도 나가지 않아 비제어로 둔다 — 브라우저가 그대로 들고 있으면 된다.
  // 버튼 활성 여부를 좌우하는 체크 상태만 React 가 안다
  const [saveAddress, setSaveAddress] = useState(false)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedOrder, setAgreedOrder] = useState(false)
  const agreed = agreedPrivacy && agreedOrder

  return (
    <OrderLayout
      title="배송지 입력·결제"
      description="받으실 곳을 입력하고 결제를 진행하세요."
      steps={['1 주문서 작성', '2 배송지·결제', '3 주문 완료']}
      current={1}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">
        {/* form 으로 묶어야 브라우저가 이름·연락처·주소를 한 배송지 프로필로 자동완성한다.
            제출은 막는다 — 아직 보낼 곳이 없고, 기본 GET 제출은 개인정보를 주소창에 남긴다 */}
        <form
          className="flex flex-col gap-[20px]"
          onSubmit={(event) => event.preventDefault()}
        >
          <Card id="receiver-heading" title="수령인 정보">
            <div className="mt-[16px] flex flex-col gap-[18px]">
              {RECEIVER_FIELDS.map((field) => (
                <Field key={field.id} {...field} />
              ))}
            </div>
          </Card>

          <Card id="address-heading" title="배송지 주소">
            <Field className="mt-[16px]" id="postcode" label="우편번호">
              <div className="flex gap-[9px]">
                <input
                  className={`h-[44px] ${INPUT_CLASS}`}
                  id="postcode"
                  name="postcode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
                {/* 주소 검색 API 가 아직 없어 동작은 비워둔다. TODO: 우편번호 검색 연동 */}
                <Button className="shrink-0" variant="secondary">
                  우편번호 검색
                </Button>
              </div>
            </Field>

            <CheckboxRow
              className="mt-[14px]"
              label="기본 배송지로 저장"
              checked={saveAddress}
              onChange={setSaveAddress}
            />

            <div className="mt-[18px] flex flex-col gap-[18px]">
              <Field
                id="address-line1"
                label="기본 주소"
                name="address1"
                autoComplete="address-line1"
              />
              <Field
                id="address-line2"
                label="상세 주소"
                name="address2"
                autoComplete="address-line2"
              />
              <Field
                id="delivery-memo"
                label="배송 메모"
                name="memo"
                placeholder="배송 메모를 입력해 주세요."
              />
            </div>
          </Card>
        </form>

        <div className="flex flex-col gap-[20px]">
          <Card id="amount-heading" title="주문 금액 요약">
            <SummaryRows className="mt-[6px]" rows={AMOUNT_ROWS} />
            <p className="mt-[14px] mb-0 text-[11px] text-ink/45">부가세 포함 금액입니다.</p>
          </Card>

          <Card id="product-heading" title="주문 상품">
            <div className="mt-[16px] flex items-center gap-[14px]">
              {/* 굿즈 렌더 이미지가 아직 없어 자리만 잡아둔다. TODO: 굿즈 이미지 연동 */}
              <p className="m-0 flex h-[62px] w-[128px] shrink-0 items-center justify-center bg-[#f2ede5] text-[10.5px] text-ink/40">
                굿즈 이미지
              </p>
              <div className="min-w-0">
                <p className="m-0 text-[13px] font-medium break-keep">Heritage Moment Vol.1</p>
                <p className="mt-[7px] mb-0 text-[11.5px] text-ink/55">레더 토트백 · 수량 1</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-[14px]">
            <CheckboxRow
              label="개인정보 수집·이용 동의"
              checked={agreedPrivacy}
              onChange={setAgreedPrivacy}
            />
            <CheckboxRow
              label="주문 내용 확인 및 결제 진행 동의"
              checked={agreedOrder}
              onChange={setAgreedOrder}
            />
            <p className="m-0 text-[11px] leading-[18px] break-keep text-ink/45">
              결제 완료 후 취소·변경이 제한될 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-[10px]">
            {/* 동의 두 개가 모두 켜져야 결제로 갈 수 있다. 화면 검증일 뿐이라
                결제 API 붙일 때 서버가 동의 여부·최종 금액을 다시 확인해야 한다.
                disabled 대신 aria-disabled 라 비활성이어도 포커스가 닿고 사유가 읽힌다 */}
            <p className="m-0 text-[11px] leading-[18px] break-keep text-ink/45" id="pay-gate">
              동의 항목 두 개를 모두 체크해야 결제할 수 있습니다.
            </p>
            <Button
              aria-disabled={!agreed}
              aria-describedby="pay-gate"
              onClick={() => {
                if (agreed) window.location.href = '/order/complete'
              }}
            >
              결제하기
            </Button>
            <Button variant="secondary" href="/order/form">
              주문서로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </OrderLayout>
  )
}

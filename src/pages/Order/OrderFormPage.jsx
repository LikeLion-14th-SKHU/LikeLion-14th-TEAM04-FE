import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/Button'
import OrderLayout from './components/OrderLayout'
import Card from './components/Card'
import Field, { INPUT_CLASS } from './components/Field'
import CheckboxRow from './components/CheckboxRow'
import SummaryRows from './components/SummaryRows'

// 가격 API 가 아직 없어 더미로 둔다. TODO: 주문 금액 계산 API 연동
const BASE_PRICE = 1200000
const ENGRAVING_PRICE = 80000
const QUANTITIES = [1, 2, 3, 4, 5]

const REVIEW_NOTES = [
  '굿즈 종류와 수량을 확인하세요.',
  '선택 옵션은 확정 후 변경이 어렵습니다.',
  '제작은 결제 완료 후 약 3~4주 소요됩니다.',
]

const won = (amount) => `₩ ${amount.toLocaleString('ko-KR')}`

export default function OrderFormPage() {
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [agreedOrder, setAgreedOrder] = useState(true)
  const [agreedPrivacy, setAgreedPrivacy] = useState(true)

  // 수량에서 바로 나오는 값이라 상태로 들고 있지 않는다
  const total = (BASE_PRICE + ENGRAVING_PRICE) * quantity
  const agreed = agreedOrder && agreedPrivacy

  return (
    <OrderLayout
      title="주문서 작성"
      description="주문할 굿즈 정보와 요청 사항을 확인하고 결제 단계로 이동하세요."
      steps={['견적 확인', '주문서 작성', '배송지·결제']}
      current={1}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">
        <div className="flex flex-col gap-[20px]">
          <Card id="goods-heading" title="주문 굿즈 정보">
            <div className="mt-[16px] flex gap-[20px] max-[640px]:flex-col">
              {/* 굿즈 렌더 이미지가 아직 없어 자리만 잡아둔다. TODO: 굿즈 미리보기 이미지 연동 */}
              <p className="m-0 flex h-[112px] w-[320px] shrink-0 items-center justify-center bg-[#f2ede5] text-[11px] text-ink/40 max-[640px]:w-full">
                굿즈 미리보기
              </p>
              <dl className="m-0 flex min-w-0 flex-1 flex-col gap-[16px]">
                <div>
                  <dt className="text-[11.5px] text-ink/50">에디션명</dt>
                  <dd className="mt-[7px] text-[15px] font-medium">Heritage Moment Vol.1</dd>
                </div>
                <div>
                  <dt className="text-[11.5px] text-ink/50">굿즈 카테고리</dt>
                  <dd className="mt-[7px] text-[13px]">레더 토트백</dd>
                </div>
              </dl>
            </div>

            <Field className="mt-[20px]" id="order-quantity" label="수량">
              {/* 화살표는 기본값 그대로 둔다 — appearance-none 으로 지우고 다시 그리면 코드만 는다 */}
              <select
                className={`h-[44px] ${INPUT_CLASS}`}
                id="order-quantity"
                name="quantity"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              >
                {QUANTITIES.map((value) => (
                  <option key={value} value={value}>
                    {value}개
                  </option>
                ))}
              </select>
            </Field>

            <Field className="mt-[18px]" id="order-request" label="요청 사항">
              <textarea
                className={`h-[96px] resize-y py-[12px] ${INPUT_CLASS}`}
                id="order-request"
                name="request"
                placeholder="제작 시 참고할 요청 사항을 입력해 주세요."
              />
            </Field>
          </Card>

          <Card id="agree-heading" title="개인정보 및 주문 동의">
            <div className="mt-[16px] flex flex-col gap-[14px]">
              <CheckboxRow
                label="주문 내용을 확인했으며 구매에 동의합니다."
                checked={agreedOrder}
                onChange={setAgreedOrder}
              />
              <CheckboxRow
                label="개인정보 수집·이용에 동의합니다. (필수)"
                checked={agreedPrivacy}
                onChange={setAgreedPrivacy}
              />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-[20px]">
          <Card id="amount-heading" title="예상 금액 요약">
            <SummaryRows
              className="mt-[6px]"
              rows={[
                { label: '굿즈 기본가', value: won(BASE_PRICE) },
                { label: '모노그램 각인', value: won(ENGRAVING_PRICE) },
                { label: '특수 패키징', value: '—' },
                { label: '수량', value: `× ${quantity}` },
                { label: '합계 (부가세 포함)', value: won(total), strong: true },
              ]}
            />
            <div className="mt-[22px] flex flex-col gap-[10px]">
              {/* 동의 두 개가 모두 켜져야 다음 단계로 갈 수 있다.
                  disabled 대신 aria-disabled 를 쓴다 — disabled 는 탭 순서에서 빠져서
                  키보드·스크린리더 사용자가 이 화면의 주 행동을 아예 만나지 못한다 */}
              <p className="m-0 text-[11px] leading-[18px] break-keep text-ink/45" id="order-gate">
                동의 항목 두 개를 모두 체크해야 다음 단계로 넘어갈 수 있습니다.
              </p>
              <Button
                aria-disabled={!agreed}
                aria-describedby="order-gate"
                onClick={() => {
                  if (agreed) navigate('/order/checkout')
                }}
              >
                배송지 입력·결제로 진행
              </Button>
              <Button variant="secondary" href="/order/quote">
                이전 단계로 돌아가기
              </Button>
            </div>
          </Card>

          <Card id="review-heading" title="주문서 검토 안내">
            <ul className="mt-[16px] mb-0 flex list-disc flex-col gap-[10px] pl-[18px]">
              {REVIEW_NOTES.map((note) => (
                <li key={note} className="text-[11.5px] leading-[20px] break-keep text-ink/55">
                  {note}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </OrderLayout>
  )
}

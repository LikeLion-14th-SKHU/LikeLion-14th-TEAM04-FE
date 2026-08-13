// 주문 흐름 화면의 카드 껍데기. 제목이 곧 섹션 이름이라 aria-labelledby 로 묶는다
export default function Card({ id, title, children }) {
  return (
    <section className="border border-frame bg-white p-[22px]" aria-labelledby={id}>
      <h2 className="m-0 text-[13.5px] font-medium" id={id}>
        {title}
      </h2>
      {children}
    </section>
  )
}

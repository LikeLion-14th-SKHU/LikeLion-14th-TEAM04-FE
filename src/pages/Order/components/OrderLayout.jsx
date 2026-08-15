import Header from '../../../components/Header'
import Panel from '../../../components/Panel'
import Steps from './Steps'

// 주문 흐름 5개 화면이 똑같이 쓰는 껍데기 — 헤더·컨테이너·제목·진행 단계까지만 맡는다
export default function OrderLayout({ title, description, steps, current, children }) {
  return (
    // Header 를 main 밖에 둔다 — main 안의 <header> 는 banner 랜드마크로 안 잡힌다
    <>
      <Header />
      <main className="min-h-[100dvh] w-full">
        {/* 캔버스 1280 안에서 좌우 48 을 뺀 1184 가 콘텐츠 폭이다 */}
        <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
          <Panel>
            <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
              {title}
            </h1>
            <p className="mt-[10px] mb-0 text-[13.5px] break-keep text-ink/62">{description}</p>
            {steps && <Steps className="mt-[18px]" steps={steps} current={current} />}
            <div className="mt-[24px]">{children}</div>
          </Panel>
        </div>
      </main>
    </>
  )
}

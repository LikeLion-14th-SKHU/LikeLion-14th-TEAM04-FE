import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import AuthPage from './pages/Auth/AuthPage'
import CommunityPage from './pages/Community/CommunityPage'
import CollectionThemePage from './pages/CollectionTheme/CollectionThemePage'
import MyPage from './pages/MyPage/MyPage'
import OrderPage from './pages/Order/OrderPage'
import QuotePage from './pages/Order/QuotePage'
import OrderFormPage from './pages/Order/OrderFormPage'
import CheckoutPage from './pages/Order/CheckoutPage'
import OrderCompletePage from './pages/Order/OrderCompletePage'
import CollectionPage from './pages/Collection/CollectionPage'
import EditionCreatePage from './pages/EditionCreate/EditionCreatePage'
import EditionGeneratingPage from './pages/EditionCreate/EditionGeneratingPage'
import EditionConceptPage from './pages/EditionCreate/EditionConceptPage'
import EditionCompletePage from './pages/EditionCreate/EditionCompletePage'
import EditionDetailPage from './pages/EditionDetail/EditionDetailPage'
import CertificatePage from './pages/EditionDetail/CertificatePage'

// 경로가 9개로 늘고 주문 흐름이 여러 단계를 오가게 되면서 라우터를 쓴다 —
// pathname 스위치는 이동할 때마다 전체 새로고침이라 화면이 매번 깜빡였다.
// 선언형(BrowserRouter + Routes)만 쓴다 — loader·action 을 쓸 데가 없다
export default function App() {
  const { pathname } = useLocation()

  // 전체 새로고침이던 시절엔 브라우저가 해주던 일이다 — 클라이언트 전환은
  // 이전 화면의 스크롤 위치를 그대로 들고 가서 페이지 중간에 떨어진다
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Routes>
      <Route path="/" element={<CollectionPage />} />

      <Route path="/collection/theme" element={<CollectionThemePage />} />

      <Route path="/edition/create" element={<EditionCreatePage />} />
      <Route path="/edition/create/generating" element={<EditionGeneratingPage />} />
      <Route path="/edition/create/concepts" element={<EditionConceptPage />} />
      <Route path="/edition/create/complete" element={<EditionCompletePage />} />

      <Route path="/edition/:editionId" element={<EditionDetailPage />} />
      <Route path="/edition/:editionId/certificate" element={<CertificatePage />} />

      <Route path="/community" element={<CommunityPage />} />

      <Route path="/mypage" element={<MyPage />} />

      <Route path="/order" element={<OrderPage />} />
      <Route path="/order/quote" element={<QuotePage />} />
      <Route path="/order/form" element={<OrderFormPage />} />
      <Route path="/order/checkout" element={<CheckoutPage />} />
      <Route path="/order/complete" element={<OrderCompletePage />} />
      {/* 없는 경로는 로그인 화면으로 — "/" 도 여기로 들어온다 */}
      <Route path="*" element={<AuthPage />} />
    </Routes>
  )
}

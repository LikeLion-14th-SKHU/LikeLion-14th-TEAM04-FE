import currentPath from './currentPath'
import AuthPage from './pages/Auth/AuthPage'
import CommunityPage from './pages/Community/CommunityPage'
import CollectionThemePage from './pages/CollectionTheme/CollectionThemePage'
import MyPage from './pages/MyPage/MyPage'
import OrderPage from './pages/Order/OrderPage'
import QuotePage from './pages/Order/QuotePage'
import OrderFormPage from './pages/Order/OrderFormPage'
import CheckoutPage from './pages/Order/CheckoutPage'
import OrderCompletePage from './pages/Order/OrderCompletePage'

// 라우터 의존성을 새로 넣지 않는다 — 경로가 몇 개뿐이라 pathname 스위치로 충분하다
// (Vite dev·preview 는 SPA fallback 이라 새로고침해도 index.html 이 뜬다)
const ROUTES = {
  '/community': CommunityPage,
  '/collection/theme': CollectionThemePage,
  '/mypage': MyPage,
  '/order': OrderPage,
  '/order/quote': QuotePage,
  '/order/form': OrderFormPage,
  '/order/checkout': CheckoutPage,
  '/order/complete': OrderCompletePage,
}

export default function App() {
  const Page = ROUTES[currentPath()] ?? AuthPage
  return <Page />
}

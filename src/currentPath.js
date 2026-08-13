// 라우터가 없어 경로를 location 에서 직접 읽는다. 화면 고르기(App)와
// 현재 메뉴 표시(Header) 두 곳이 같은 값을 봐야 해서 여기 한 곳에 둔다.
// 끝의 슬래시만 떼면 충분하다 — 쿼리·해시는 pathname 에 안 들어온다
export default function currentPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

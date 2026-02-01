// Navigation용 경로 (NavLink에서 사용)
export enum NavPath {
  Home = '/',
  Blog = '/blog',
  Portfolio = '/portfolio',
  Login = '/login',
}

// Route용 경로 (Routes에서 사용, 와일드카드 포함)
export enum RoutePath {
  Home = '/*',
  Blog = '/blog/*',
  Portfolio = '/portfolio/*',
  Login = '/login',
  NotFound = '*',
}

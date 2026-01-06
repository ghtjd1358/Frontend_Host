// Remote Module 타입 선언
declare module '@resume/App' {
  const App: React.ComponentType;
  export default App;
}

declare module '@blog/App' {
  const App: React.ComponentType;
  export default App;
}

declare module '@portfolio/App' {
  const App: React.ComponentType;
  export default App;
}

// LnbItem 타입 정의
export interface LnbItem {
  title: string;
  link: string;
  searchStr?: string;
  subItems?: LnbItem[];
}

// Remote LnbItems 모듈 선언
declare module '@resume/LnbItems' {
  import { LnbItem } from './remote.d';
  export const lnbItems: LnbItem[];
  export default lnbItems;
}

declare module '@blog/LnbItems' {
  import { LnbItem } from './remote.d';
  export const lnbItems: LnbItem[];
  export default lnbItems;
}

declare module '@portfolio/LnbItems' {
  import { LnbItem } from './remote.d';
  export const lnbItems: LnbItem[];
  export default lnbItems;
}


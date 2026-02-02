/**
 * Remote Module 타입 선언
 * Module Federation으로 로드되는 Remote 앱 타입 정의
 */

declare module '@resume/App' {
  import { ComponentType } from 'react';
  const App: ComponentType<Record<string, never>>;
  export default App;
}

declare module '@blog/App' {
  import { ComponentType } from 'react';
  const App: ComponentType<Record<string, never>>;
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


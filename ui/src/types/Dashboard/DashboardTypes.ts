import { ReactNode } from 'react';

export interface ISection {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

export interface IExamesDashboard {
  type: 1 | 2 | 3;
  navigate?: Function;
}

// export type TDataCardExame = {
//   title: string;
//   subtitle: string;
//   description: string;
//   situation: TSituation
// }

export interface ICardExame {
  data: any;
  onClick: (e: any) => void;
}

export interface ITagSituation {
  situation: string;
}

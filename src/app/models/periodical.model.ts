import { Resource } from './resource.model';

export interface PeriodicalLight extends Resource {  
  title: string;
}
export interface Periodical extends PeriodicalLight {
  notice: string;
}

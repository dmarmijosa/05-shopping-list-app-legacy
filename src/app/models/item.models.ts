import { IUnit } from './unit.models';

export interface IItem {
  id?: number;
  description: string;
  quantity: number;
  unit?: IUnit;
  checked: boolean;
}

import { inject, Injectable, signal } from '@angular/core';
import { SqliteManagerService } from './sqlite-manager.service';
import { IUnit } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private readonly sqliManager = inject(SqliteManagerService);
  unitsSignals = signal<IUnit[]>([]);

  constructor() {
    // Cargar unidades cuando la base de datos esté lista
    if (this.sqliManager.isReady()) {
      this.getUnitys();
    }
  }

  async getUnitys() {
    const statement = `
      SELECT * FROM units ORDER BY description
    `;
    return await this.sqliManager
      .executeQuery(statement)
      .then((response: any[] | (() => any) | undefined) => {
        const units: IUnit[] = [];
        if (Array.isArray(response)) {
          for (const row of response) {
            const unit: IUnit = row;
            units.push(unit);
          }
        }
        this.unitsSignals.set(units);
        return units;
      });
  }
}

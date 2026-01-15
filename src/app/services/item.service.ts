import { inject, Injectable } from '@angular/core';
import { SqliteManagerService } from './sqlite-manager.service';
import { IItem } from '../models';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private sqliteManager = inject(SqliteManagerService);

  async createItem(item: IItem) {
    // incursiones de código aquí
    const statamnt = `INSERT INTO items (description, quantity, unit, checked) VALUES (?, ?, ?, ?)`;
    const values = [item.description, item.quantity, item.unit?.id, false];
    return await this.sqliteManager
      .executeInstruction(statamnt, values)
      .then((result: capSQLiteChanges) => {
        return result;
      });
  }
}

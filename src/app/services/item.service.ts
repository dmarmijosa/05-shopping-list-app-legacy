import { inject, Injectable, signal } from '@angular/core';
import { SqliteManagerService } from './sqlite-manager.service';
import { IItem } from '../models';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private sqliteManager = inject(SqliteManagerService);
  itemsSignal = signal<IItem[]>([]);

  async createItem(item: IItem) {
    // incursiones de código aquí
    const statamnt = `INSERT INTO items (description, quantity, unit, checked) VALUES (?, ?, ?, ?)`;
    const values = [item.description, item.quantity, item.unit?.id, false];
    return await this.sqliteManager
      .executeInstruction(statamnt, values)
      .then((changes: capSQLiteChanges) => {
        if (changes.changes?.lastId) {
          item.id = changes.changes.lastId;
          this.itemsSignal.update((items) => [...items, item]);
        }
        return changes;
      });
  }

  async getItems(): Promise<IItem[]> {
    const statement = `SELECT i.id, i.description, i.quantity, i.checked, u.id as unitId, u.description as unitDescription FROM items i LEFT JOIN units u ON i.unit = u.id`;
    return await this.sqliteManager
      .executeQuery(statement)
      .then((response: any[] | undefined) => {
        const items: IItem[] = [];
        if (response) {
          console.log('Response from getItems:', response);
          response.forEach((row) => {
            items.push({
              id: row.id,
              description: row.description,
              checked: row.checked === 1,
              quantity: row.quantity,
              unit: row.unitId
                ? { id: row.unitId, description: row.unitDescription }
                : undefined,
            });
          });
        }
        this.itemsSignal.set(items);
        return items;
      });
  }

  // Más métodos para actualizar y eliminar ítems pueden ser añadidos aquí
}

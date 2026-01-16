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
      .then((result: capSQLiteChanges) => {
        return result;
      });
  }

  async getItems(): Promise<IItem[]> {
    const statement = `SELECT * FROM items`;
    return await this.sqliteManager
      .executeQuery(statement)
      .then((response: any[] | undefined) => {
        const items: IItem[] = [];
        if (response) {
          response.forEach((row) => {
            items.push({
              id: row.id,
              description: row.description,
              quantity: row.quantity,
              checked: row.checked === 1,
            });
          });
        }
        this.itemsSignal.set(items);
        return items;
      });
  }

  // Más métodos para actualizar y eliminar ítems pueden ser añadidos aquí
}

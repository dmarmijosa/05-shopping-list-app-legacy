import { inject, Injectable } from '@angular/core';
import { SqliteManagerService } from './sqlite-manager.service';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private sqlLIteManagerService = inject(SqliteManagerService);

  async getSettingByKey(key: string) {
    const statement = `SELECT value FROM settings WHERE key = ?`;
    const values = [key];
    const resp = await this.sqlLIteManagerService.executeQuery(
      statement,
      values
    );
    return resp ? (resp[0].value as string) : '';
  }

  async updateSettingByKey(key: string, value: string) {
    const statement = `UPDATE settings SET value = ? WHERE key = ?`;
    const values = [value, key];
    const result = await this.sqlLIteManagerService.executeInstruction(
      statement,
      values
    );
    return result;
  }
}

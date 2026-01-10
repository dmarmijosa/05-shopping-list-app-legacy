import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, capSQLiteResult } from '@capacitor-community/sqlite';
import { database } from '../../assets/db/db.json';

@Injectable({
  providedIn: 'root',
})
export class SqliteManagerService {
  private platform: Platform = inject(Platform);

  public isWebSignal = signal(false);
  public isIos = signal(false);
  public isReady = signal(false);

  private readonly DB_NAME = database;

  async init() {
    if (this.platform.is('desktop')) {
      this.isWebSignal.set(true);
      await CapacitorSQLite.initWebStore();
    } else if (this.platform.is('ios')) {
      this.isIos.set(true);
    }

    const databaseExists: capSQLiteResult = await CapacitorSQLite.isDatabase({
      database: this.DB_NAME,
    });

    if (!databaseExists.result) await this.downloadDatabase();

    await this.connectDatabase();
  }

  async downloadDatabase() {
    fetch('assets/db/db.json').then(async (value: Response) => {
      const jsonstring = await value.text();

      const isValid = await CapacitorSQLite.isJsonValid({
        jsonstring,
      });

      if (isValid) {
        await CapacitorSQLite.importFromJson({ jsonstring });
      }
    });
  }

  async connectDatabase() {
    await CapacitorSQLite.createConnection({ database: this.DB_NAME });
    await CapacitorSQLite.open({ database: this.DB_NAME });
    this.isReady.set(true);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
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
    const isWeb = Capacitor.getPlatform() === 'web';

    if (isWeb) {
      // Asegura que el DOM esté listo para encontrar el elemento
      if (document.readyState === 'loading') {
        await new Promise((resolve) =>
          document.addEventListener(
            'DOMContentLoaded',
            resolve as EventListener
          )
        );
      }

      // Garantiza que el elemento jeep-sqlite exista en el DOM
      if (!document.querySelector('jeep-sqlite')) {
        const el = document.createElement('jeep-sqlite');
        document.body.prepend(el);
      }

      // Espera a que el custom element esté definido (por si lo registra el plugin)
      try {
        // no falla si no está registrado aún; sólo espera si aplica
        await customElements.whenDefined('jeep-sqlite');
      } catch {}

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

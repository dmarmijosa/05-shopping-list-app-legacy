import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteManagerService } from './services/sqlite-manager.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  private sqliteManagerService: SqliteManagerService =
    inject(SqliteManagerService);
  private platform: Platform = inject(Platform);

  ngOnInit(): void {
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(() => {
      this.sqliteManagerService.init();
    });
  }
}

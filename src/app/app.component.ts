import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SqliteManagerService } from './services/sqlite-manager.service';
import { LoadingController, Platform } from '@ionic/angular';

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
  private loading: HTMLIonLoadingElement | null = null;

  private loadingCtrl = inject(LoadingController);

  isWebSignal = this.sqliteManagerService.isWebSignal.asReadonly();
  isReady = this.sqliteManagerService.isReady.asReadonly();

  ngOnInit(): void {
    this.initApp();
    console.log(this.isReady());
  }

  async initApp() {
    this.loading = await this.loadingCtrl.create({
      message: 'Initializing App...',
    });
    await this.loading.present();
    this.platform.ready().then(() => {
      this.sqliteManagerService.init();
    });
  }

  constructor() {
    effect(() => {
      if (this.isReady()) {
        this.loading?.dismiss();
      }
    });
  }
}

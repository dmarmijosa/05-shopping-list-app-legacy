import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertController = inject(AlertController);

  async alertMessage(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Ok'],
    });
    await alert.present();
  }

  async alertConfirm(
    header: string,
    message: string,
    functionOK: Function,
    cancelText: string = 'Cancelar',
    confirmText: string = 'Confirmar'
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => {
            functionOK();
          },
        },
      ],
    });
    await alert.present();
  }
}

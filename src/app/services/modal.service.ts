import { inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
export type ModalRole =
  | 'confirm'
  | 'cancel'
  | 'backdrop'
  | 'close'
  | 'ok'
  | string;

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalCtrl = inject(ModalController);

  /**
   * Abre un modal y devuelve { data, role } cuando se cierra.
   * component: componente a renderizar en el modal
   * componentProps: props que se pasan al componente
   * options: opciones opcionales (initialBreakpoint, breakpoints, cssClass, etc.)
   */
  async open<T = any>(
    component: any,
    options?: {
      initialBreakpoint?: number;
      breakpoints?: number[];
      cssClass?: string;
    }
  ): Promise<{ data?: T; role?: ModalRole }> {
    const modal = await this.modalCtrl.create({
      component,
      initialBreakpoint: options?.initialBreakpoint ?? 0.25,
      breakpoints: options?.breakpoints ?? [0, 0.25, 0.5, 0.75],
      cssClass: options?.cssClass,
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    return { data, role: role as ModalRole };
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
} from '@ionic/angular/standalone';
import { IItem } from '../../../../models/index';
import { UnitService } from 'src/app/services/unit.service';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  imports: [IonToolbar, IonHeader, IonButtons, IonButton, IonContent],
})
export class FormItemComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly unitService = inject(UnitService);

  unists = this.unitService.unitsSignals;
  item: IItem = {
    description: '',
    quantity: 1,
    checked: false,
  };
  constructor() {}

  ngOnInit() {
    console.log('Units in modal:', this.unists());
  }

  confirm() {
    this.modalCtrl.dismiss(this.item, 'confirm');
  }
}

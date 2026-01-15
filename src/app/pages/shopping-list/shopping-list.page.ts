import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  ModalController,
  IonToolbar,
  IonItem,
  IonIcon,
} from '@ionic/angular/standalone';
import { FormItemComponent } from './components/form-item/form-item.component';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { ItemService } from 'src/app/services/item.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
  ],
})
export class ShoppingListPage implements OnInit {
  private modalCtrl: ModalController = inject(ModalController);
  private temService = inject(ItemService);
  private toastService = inject(ToastService);

  constructor() {
    addIcons({
      addOutline,
    });
  }

  ngOnInit() {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FormItemComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.5, 0.75],
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm')
      this.temService
        .createItem(data)
        .then(() => {
          this.toastService.showToast('Item created successfully!');
        })
        .catch((error) => {
          this.toastService.showToast(`Error creating item: ${error.message}`);
        });
  }
}

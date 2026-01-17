import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  ModalController,
  IonToolbar,
  IonItem,
  IonIcon,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonText,
  IonCheckbox,
  IonButton,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { FormItemComponent } from './components/form-item/form-item.component';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, trashBin } from 'ionicons/icons';
import { ItemService } from 'src/app/services/item.service';
import { ToastService } from 'src/app/services/toast.service';
import { IGroupItems } from 'src/app/models/group-items.model';
import { IItem } from 'src/app/models';
import { capSQLiteChanges } from '@capacitor-community/sqlite';
import { AlertService } from 'src/app/services/alert.service';
import { every } from 'rxjs';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonText,
    IonLabel,
    IonItemDivider,
    IonItemGroup,
    IonIcon,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
    IonCheckbox,
    IonButton,
  ],
})
export class ShoppingListPage implements OnInit {
  private modalCtrl: ModalController = inject(ModalController);
  private itemService = inject(ItemService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  public groupItems: IGroupItems[] = [
    {
      name: 'Pendientes',
      items: [],
    },
    {
      name: 'Completados',
      items: [],
    },
  ];

  constructor() {
    addIcons({ addOutline, closeOutline, trashBin });

    effect(() => {
      this.groupItems[0].items = this.itemService
        .itemsSignal()
        .filter((item) => !item.checked);
      this.groupItems[1].items = this.itemService
        .itemsSignal()
        .filter((item) => item.checked);
    });
  }

  async ngOnInit() {
    await this.itemService.getItems();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FormItemComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.5, 0.75],
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm')
      this.itemService
        .createItem(data)
        .then(() => {
          this.toastService.showToast('Item created successfully!');
        })
        .catch((error) => {
          this.toastService.showToast(`Error creating item: ${error.message}`);
        });
  }

  updateItem(item: IItem) {
    item.checked = !item.checked;
    this.itemService
      .updateItem(item)
      .then((change: capSQLiteChanges) => {
        this.toastService.showToast('Se ha modificado el item');
      })
      .catch((error) => {
        this.toastService.showToast('No se ha modificado el item');
      });
  }

  confirmDelete(item: IItem) {
    this.alertService.alertConfirm(
      'Confirmar eliminar',
      '¿Estas seguro de borrar el item?',
      () => this.deleteItem(item)
    );
  }

  deleteItem(item: IItem) {
    this.itemService
      .deleteItem(item)
      .then((changes: capSQLiteChanges) =>
        this.toastService.showToast('Se ha eliminado el item')
      )
      .catch((err) => this.toastService.showToast('Hubo un error al eliminar'));
  }

  filterItems($event: Event) {
    const target = $event.target as HTMLIonSearchbarElement;
    const value = target.value;
    this.itemService.getItems(value!);
  }
}

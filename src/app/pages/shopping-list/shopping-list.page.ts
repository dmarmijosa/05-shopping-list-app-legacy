import { Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
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
  IonButtons,
  IonToggle,
} from '@ionic/angular/standalone';
import { FormItemComponent } from './components/form-item/form-item.component';
import { addIcons } from 'ionicons';
import {
  addOutline,
  closeOutline,
  trashBin,
  sunny,
  sunnyOutline,
  moonOutline,
} from 'ionicons/icons';
import { ItemService } from 'src/app/services/item.service';
import { ToastService } from 'src/app/services/toast.service';
import { IGroupItems } from 'src/app/models/group-items.model';
import { IItem } from 'src/app/models';
import { capSQLiteChanges } from '@capacitor-community/sqlite';
import { AlertService } from 'src/app/services/alert.service';
import { Theme } from 'src/app/types';
import { ModalService } from 'src/app/services/modal.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ToogleThemeDirective } from 'src/app/directives/toogle-theme.directive';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  imports: [
    IonToggle,
    IonButtons,
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
    ToogleThemeDirective,
    NgClass,
  ],
})
export class ShoppingListPage implements OnInit {
  private modalService = inject(ModalService);
  private itemService = inject(ItemService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private settingsService = inject(SettingsService);

  public theme?: Theme;
  private readonly SETTING_THEME = 'THEME';

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
    addIcons({
      sunnyOutline,
      moonOutline,
      addOutline,
      closeOutline,
      sunny,
      trashBin,
    });

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
    this.theme = (await this.settingsService.getSettingByKey(
      this.SETTING_THEME
    )) as Theme;

    console.log('Current theme:', this.theme);
  }

  async openModal() {
    const { data, role } = await this.modalService.open(FormItemComponent, {
      initialBreakpoint: 0.5,
    });
    if (role === 'confirm') {
      this.itemService
        .createItem(data)
        .then(() => this.toastService.showToast('Item created successfully!'))
        .catch((error) =>
          this.toastService.showToast(`Error creating item: ${error.message}`)
        );
    }
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

  async updateThemeSet(theme: Theme) {
    try {
      this.theme = theme;
      await this.settingsService.updateSettingByKey(this.SETTING_THEME, theme);
      this.toastService.showToast('Tema actualizado correctamente');
    } catch (error: any) {
      this.toastService.showToast(`Error al actualizar tema: ${error.message}`);
    }
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
} from '@ionic/angular/standalone';
import { IItem } from '../../../../models/index';
import { UnitService } from 'src/app/services/unit.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  imports: [
    IonTitle,
    IonInput,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonToolbar,
    IonHeader,
    IonButtons,
    IonButton,
    IonContent,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
    IonLabel,
  ],
})
export class FormItemComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly unitService = inject(UnitService);
  form = new FormGroup({
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    quantity: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    unit: new FormControl(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  unitsSignal = this.unitService.unitsSignals;
  item: IItem = {
    description: '',
    quantity: 1,
    checked: false,
  };
  constructor() {}

  ngOnInit() {
    console.log('Units in modal:', this.unitsSignal());
  }

  // Método para verificar si un campo tiene error y fue tocado
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Método para obtener el mensaje de error específico
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }
    if (field.errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${
        field.errors['minlength'].requiredLength
      } caracteres`;
    }
    if (field.errors['min']) {
      return `${this.getFieldLabel(fieldName)} debe ser mayor o igual a ${
        field.errors['min'].min
      }`;
    }
    return 'Error en el campo';
  }

  // Método auxiliar para obtener el nombre legible del campo
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      description: 'Descripción',
      quantity: 'Cantidad',
      unit: 'Unidad',
    };
    return labels[fieldName] || fieldName;
  }

  confirm() {
    if (this.form.valid) {
      this.item.description = this.form.value.description!;
      this.item.quantity = this.form.value.quantity!;
      this.item.unit = this.form.value.unit!;
      this.modalCtrl.dismiss(this.item, 'confirm');
    } else {
      // Solo marcar como tocados los campos de texto/número, no el select
      this.form.get('description')?.markAsTouched();
      this.form.get('quantity')?.markAsTouched();
    }
  }
}

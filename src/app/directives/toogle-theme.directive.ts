import {
  Directive,
  HostListener,
  inject,
  input,
  output,
  Renderer2,
} from '@angular/core';
import { Theme } from '../types';

@Directive({
  selector: '[appToogleTheme]',
  standalone: true,
})
export class ToogleThemeDirective {
  private renderer = inject(Renderer2);
  themeInitial = input<Theme>('light');
  themeSelected = output<Theme>();

  @HostListener('ionChange', ['$event']) onIonChange(event: any) {
    this.switchTheme(event.detail.checked);
  }

  ngOnInit() {
    // Aplicar el tema inicial al cargar la página
    this.applyTheme(this.themeInitial());
  }

  private applyTheme(theme: Theme) {
    const ionAppElement = document.querySelector('ion-app');
    if (ionAppElement) {
      if (theme === 'dark') {
        this.renderer.addClass(ionAppElement, 'ion-palette-dark');
      } else {
        this.renderer.removeClass(ionAppElement, 'ion-palette-dark');
      }
    }
  }

  private switchTheme(isDark: boolean) {
    const ionAppElement = document.querySelector('ion-app');
    if (ionAppElement) {
      if (isDark) {
        this.renderer.addClass(ionAppElement, 'ion-palette-dark');
        this.themeSelected.emit('dark');
      } else {
        this.renderer.removeClass(ionAppElement, 'ion-palette-dark');
        this.themeSelected.emit('light');
      }
    }
  }
}

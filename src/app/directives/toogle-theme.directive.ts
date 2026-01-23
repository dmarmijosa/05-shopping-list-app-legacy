import { Directive, HostListener, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToogleTheme]',
  standalone: true,
})
export class ToogleThemeDirective {
  private renderer = inject(Renderer2);

  @HostListener('click') onClick() {
    this.switchTheme();
  }

  private switchTheme() {
    const ionAppElemnt = document.querySelector('ion-app');
    if (ionAppElemnt) {
      if (ionAppElemnt.classList.contains('ion-palette-dark')) {
        this.renderer.removeClass(ionAppElemnt, 'ion-palette-dark');
      } else {
        this.renderer.addClass(ionAppElemnt, 'ion-palette-dark');
      }
    }
  }
}

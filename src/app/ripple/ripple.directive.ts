import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnInit,
  Renderer2,
} from '@angular/core';

const RIPPLE_ANIMATION_DURATION = 300;
const DEFAULT_RIPPLE_COLOR = '#9299a2';
const IOS_OPACITY = 0.6;

const px = (str) => str + 'px';

@Directive({
  selector: '[app-ripple]',
})
export class BuiRippleAnimationDirective implements OnInit {
  @Input()
  rippleColor = DEFAULT_RIPPLE_COLOR;

  @Input()
  centered = false;

  @Input()
  useOpacity = false;

  private readonly element: HTMLElement;
  private isTouched = false;
  private animatingRipple = null;

  constructor(
      elementRef: ElementRef<HTMLElement>,
      private renderer: Renderer2,
      private chr: ChangeDetectorRef,
  ) {
      this.element = elementRef.nativeElement;
  }

  ngOnInit() {
      if (this.useOpacity) {
          return;
      }

      const {position} = getComputedStyle(this.element);

      if (!position || position === 'static') {
          this.renderer.setStyle(this.element, 'position', 'relative');
      }

      this.renderer.setStyle(this.element, 'overflow', 'hidden');
      this.renderer.setStyle(this.element, 'transformStyle', 'preserve-3d');
  }

  @HostListener('touchstart', ['$event'])
  handleStart(event: TouchEvent) {
      requestAnimationFrame(() => this.animate(event));
  }

  @HostListener('touchend')
  handleEnd() {
      this.isTouched = false;

      if (this.animatingRipple) {
          this.removeRipple(this.animatingRipple);
      }
  }

  private animate(event: TouchEvent) {
      const {clientX, clientY, radiusX, radiusY} = event.touches[0];
      const {top, left, height, width} = this.element.getBoundingClientRect();

      const ripple = this.renderer.createElement('div');

      const ripplePosition = {
          x: Math.round(Math.abs(top - clientY + radiusY)),
          y: Math.round(Math.abs(left - clientX + radiusX)),
      };

      console.log(ripplePosition);


      this.isTouched = true;

      this.renderer.addClass(ripple, 'bui-ripple');
      this.renderer.appendChild(this.element, ripple);

      this.renderer.setStyle(ripple, 'top', px(ripplePosition.x));
      this.renderer.setStyle(ripple, 'left', px(ripplePosition.y));
      this.renderer.setStyle(ripple, 'backgroundColor', this.rippleColor);

      requestAnimationFrame(() => {
          setTimeout(() => {
            this.animatingRipple = ripple;

            if (!this.isTouched) {
              this.removeRipple(ripple);
            }
          }, RIPPLE_ANIMATION_DURATION);

          this.renderer.setStyle(
              ripple,
              'transform',
              `scale(${2 * Math.round(Math.sqrt(width * width + height * height))})`,
          );
          this.renderer.addClass(ripple, 'bui-ripple_fade-in');
      });
  }

  private removeRipple(ripple: HTMLElement) {
      this.renderer.addClass(ripple, 'bui-ripple_fade-out');
      this.animatingRipple = null;

      setTimeout(() => {
          this.renderer.removeChild(this.element, ripple);
          requestAnimationFrame(() => this.chr.markForCheck());
      }, 500);
  }
}

import { Directive, Output, EventEmitter, HostBinding, HostListener, ElementRef, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable, of, Subject, fromEvent } from 'rxjs';
import { takeWhile, takeUntil, filter, tap } from 'rxjs/operators';

@Directive({
  selector: '[pull-to-refresh]'
})
export class P2rDirective implements OnInit, OnDestroy {
  @Input()
  handleRefresh = true;

  mouseY = 0;
  startMouseY = 0;

  @Output()
  refresh = new EventEmitter();

  private destroy$ = new Subject();
  private loaderElement: HTMLElement;
  private scrolledIntoBreakpoint = false;

  constructor(private elementRef: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngOnInit() {
    this.loaderElement = document.createElement('div');
    this.loaderElement.classList.add('loader');
    this.elementRef.nativeElement.appendChild(this.loaderElement);

    const moveHandler = this.moveHandler.bind(this);

    this.elementRef.nativeElement.addEventListener('touchstart', (ev) => {
      this.mouseY = ev.touches[0].clientY;
      this.startMouseY = this.mouseY;
      this.scrolledIntoBreakpoint = false;
      this.elementRef.nativeElement.addEventListener('touchmove', moveHandler);
    });
    this.elementRef.nativeElement.addEventListener('touchend', () => {
      if (this.scrolledIntoBreakpoint) {
        this.loaderElement.classList.add('loader_fade-out');
        this.loaderElement.style.transform = `translateY(150px)`;

        console.log('refreshing...');

        setTimeout(() => {
          this.loaderElement.style.opacity = '0';
          this.loaderElement.style.transform = `translateY(0)`;
          console.log('refreshed...');
        }, 1000);
      } else {
        this.loaderElement.classList.add('loader_fade-out');
        this.loaderElement.style.transform = `translateY(0)`;
      }

      this.elementRef.nativeElement.removeEventListener('touchmove', moveHandler);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private moveHandler(e: any): any {
    if (e.touches[0].clientY > this.mouseY) {
      const d = e.touches[0].clientY - this.startMouseY;

      e.preventDefault();

      if (d >= 200) {
        this.loaderElement.style.opacity = '1';
        this.loaderElement.classList.remove('loader_fade-out');
        this.loaderElement.style.transform = `translateY(${Math.min(250, Math.abs(200 - d))}px)`;

        this.scrolledIntoBreakpoint = Math.abs(200 - d) >= 150;
      }
    }
  }
}

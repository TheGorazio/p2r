import { BrowserModule, } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { BuiRippleAnimationModule } from './ripple/ripple.module';
import { P2rDirective } from './p2r.directive';

@NgModule({
  declarations: [
    AppComponent,
    P2rDirective
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    BuiRippleAnimationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

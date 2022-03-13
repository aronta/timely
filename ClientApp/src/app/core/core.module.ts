import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ProjectService } from './services/project.service';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [NavMenuComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    SharedModule,
    HttpClientModule,
  ],
  exports: [NavMenuComponent],
  providers: [ProjectService],
})
export class CoreModule {}

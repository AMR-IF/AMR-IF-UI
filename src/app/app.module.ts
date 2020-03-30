/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingDetailComponent } from './settings/setting-detail/setting-detail.component';
import { PosesComponent } from './poses/poses.component';
import { PoseDetailComponent } from './poses/pose-detail/pose-detail.component';
import { PoseFormComponent } from './poses/pose-form/pose-form.component';
import { RobotsComponent } from './robots/robots.component';
import { RobotDetailComponent } from './robots/robot-detail/robot-detail.component';
import { RobotFormComponent } from './robots/robot-form/robot-form.component';
import { CommandsComponent } from './commands/commands.component';
import { CmdListsComponent } from './cmd-lists/cmd-lists.component';
import { CmdListDetailComponent } from './cmd-lists/cmd-list-detail/cmd-list-detail.component';
import { CmdListFormComponent } from './cmd-lists/cmd-list-form/cmd-list-form.component';
import { ViewerComponent } from './viewer/viewer.component';
import { InputDialogComponent } from './viewer/input-dialog/input-dialog.component';
import { SelectDialogComponent } from './viewer/select-dialog/select-dialog.component';
import { InitializerService } from './shared/config/initializer.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidenavComponent,
    SettingsComponent,
    SettingDetailComponent,
    PosesComponent,
    PoseDetailComponent,
    PoseFormComponent,
    RobotsComponent,
    RobotDetailComponent,
    RobotFormComponent,
    CommandsComponent,
    CmdListsComponent,
    CmdListDetailComponent,
    CmdListFormComponent,
    ViewerComponent,
    InputDialogComponent,
    SelectDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule
  ],
  entryComponents: [
    InputDialogComponent,
    SelectDialogComponent
  ],
  providers: [
    InitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (initializerService: InitializerService) => () =>
        initializerService.initialize(),
      deps: [InitializerService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  /**
   * オブジェクトを構築する。
   * インジェクターからサービスを取得する。
   *
   * @param injector インジェクター
   */
  constructor(private injector: Injector) {
    InitializerService.injector = this.injector;
  }
}

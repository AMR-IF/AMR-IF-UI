/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RobotsComponent } from './robots/robots.component';
import { RobotDetailComponent } from './robots/robot-detail/robot-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { PosesComponent } from './poses/poses.component';
import { PoseDetailComponent } from './poses/pose-detail/pose-detail.component';
import { SettingDetailComponent } from './settings/setting-detail/setting-detail.component';
import { CmdListsComponent } from './cmd-lists/cmd-lists.component';
import { CmdListDetailComponent } from './cmd-lists/cmd-list-detail/cmd-list-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'robots', component: RobotsComponent },
  { path: 'robot/detail/:id', component: RobotDetailComponent },
  { path: 'poses', component: PosesComponent },
  { path: 'pose/detail/:id', component: PoseDetailComponent },
  { path: 'cmd-lists', component: CmdListsComponent },
  { path: 'cmd-list/detail/:id', component: CmdListDetailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'setting/detail/:id', component: SettingDetailComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

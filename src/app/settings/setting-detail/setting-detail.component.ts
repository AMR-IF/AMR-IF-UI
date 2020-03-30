/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Setting } from '../shared/setting.model';
import { SettingService } from '../shared/setting.service';
import { StorageDetail } from '../../shared/storage/storage-detail';

/**
 * 設定の詳細を表示するコンポーネントです。
 */
@Component({
  selector: 'app-setting-detail',
  templateUrl: './setting-detail.component.html',
  styleUrls: ['./setting-detail.component.css']
})
export class SettingDetailComponent extends StorageDetail<Setting, SettingService> {
  /** 設定 */
  @Input() model: Setting;
  @Input() edit: Setting;

  /**
   * オブジェクトを構築する。
   *
   * @param service サービス
   * @param route ルート
   * @param location ロケーション
   */
  constructor(
    public service: SettingService,
    public route: ActivatedRoute,
    public location: Location
  ) {
    super();
  }
}

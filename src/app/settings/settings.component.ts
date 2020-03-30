/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Setting } from './shared/setting.model';
import { ConfigService } from '../shared/config/config.service';
import { SettingService } from './shared/setting.service';
import { StorageComponent } from '../shared/storage/storage-component';
import { StoreService } from '../shared/store/store.service';

/**
 * セッティングのコンポーネントです。
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends StorageComponent<Setting, SettingService> {
  /** ダウンロードプレフィックスネーム */
  downloadPrefixName = 'settings';

  /**
   * オブジェクトを構築する。
   *
   * @param service セッティングサービス
   * @param storeService ストアサービス
   * @param configService コンフィグサービス
   * @param renderer2 レンダラー2
   * @param router ルーター
   */
  constructor(
    public service: SettingService,
    public storeService: StoreService,
    private configService: ConfigService,
    public renderer2: Renderer2,
    private router: Router
  ) {
    super();
  }

  /**
   * データをクリアする。
   */
  async clear(): Promise<void> {
    await super.clear();
    await this.service.addSettings();
  }

  /**
   * データをすべて消去し再ロードする。
   *
   * @return プロミス
   */
  async reset(): Promise<void> {
    await this.configService.removeAll();
    await this.router.navigate(['./']);
    window.location.reload();
  }
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Renderer2 } from '@angular/core';
import { Robot } from './shared/robot.model';
import { RobotService } from './shared/robot.service';
import { StorageComponent } from '../shared/storage/storage-component';
import { StoreService } from '../shared/store/store.service';

/**
 * ロボットのコンポーネントです。
 */
@Component({
  selector: 'app-robots',
  templateUrl: './robots.component.html',
  styleUrls: ['./robots.component.css']
})
export class RobotsComponent extends StorageComponent<Robot, RobotService> {
  /** ダウンロードプレフィックスネーム */
  downloadPrefixName = 'robots';

  /**
   * オブジェクトを構築する。
   *
   * @param service ロボットサービス
   * @param storeService ストアサービス
   * @param renderer2 レンダラー2
   */
  constructor(
    public service: RobotService,
    public storeService: StoreService,
    public renderer2: Renderer2
  ) {
    super();
  }
}

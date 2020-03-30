/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Renderer2 } from '@angular/core';
import { Pose } from './shared/pose.model';
import { PoseService } from './shared/pose.service';
import { StorageComponent } from '../shared/storage/storage-component';
import { StoreService } from '../shared/store/store.service';

/**
 * ポーズのコンポーネントです。
 */
@Component({
  selector: 'app-poses',
  templateUrl: './poses.component.html',
  styleUrls: ['./poses.component.css']
})
export class PosesComponent extends StorageComponent<Pose, PoseService> {
  /** ダウンロードプレフィックスネーム */
  downloadPrefixName = 'poses';

  /**
   * オブジェクトを構築する。
   *
   * @param service ポーズサービス
   * @param renderer2 レンダラー2
   * @param storeService ストアサービス
   */
  constructor(
    public service: PoseService,
    public renderer2: Renderer2,
    public storeService: StoreService
  ) {
    super();
  }
}

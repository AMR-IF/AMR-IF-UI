/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Pose } from '../shared/pose.model';
import { PoseService } from '../shared/pose.service';
import { StorageDetail } from '../../shared/storage/storage-detail';

/**
 * ポーズの詳細を表示するコンポーネントです。
 */
@Component({
  selector: 'app-pose-detail',
  templateUrl: './pose-detail.component.html',
  styleUrls: ['./pose-detail.component.css']
})
export class PoseDetailComponent extends StorageDetail<Pose, PoseService> {
  /** ポーズ */
  @Input()
  model: Pose;

  /**
   * オブジェクトを構築する。
   *
   * @param service サービス
   * @param route ルート
   * @param location ロケーション
   */
  constructor(
    public service: PoseService,
    public route: ActivatedRoute,
    public location: Location
  ) {
    super();
  }
}

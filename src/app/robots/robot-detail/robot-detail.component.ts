/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Robot } from '../shared/robot.model';
import { RobotService } from '../shared/robot.service';
import { StorageDetail } from '../../shared/storage/storage-detail';

/**
 * ロボットの詳細を表示するコンポーネントです。
 */
@Component({
  selector: 'app-robot-detail',
  templateUrl: './robot-detail.component.html',
  styleUrls: ['./robot-detail.component.css']
})
export class RobotDetailComponent extends StorageDetail<Robot, RobotService> {
  /** ロボット */
  @Input()
  model: Robot;

  /**
   * オブジェクトを構築する。
   *
   * @param service サービス
   * @param route ルート
   * @param location ロケーション
   */
  constructor(
    public service: RobotService,
    public route: ActivatedRoute,
    public location: Location
  ) {
    super();
  }
}

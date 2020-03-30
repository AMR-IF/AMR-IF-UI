/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Input } from '@angular/core';
import { Robot } from '../shared/robot.model';
import { MaterialColor } from '../../shared/material-color';
import { MaterialColorOptions } from '../../shared/material-color-options';

/**
 * ロボットのフォームを表示するコンポーネントです。
 */
@Component({
  selector: 'app-robot-form',
  templateUrl: './robot-form.component.html',
  styleUrls: ['./robot-form.component.css']
})
export class RobotFormComponent {
  /** ロボット */
  @Input()
  edit: Robot;

  /** 候補として表示するネームのオプション */
  nameOptions: string[] = [];

  /** 候補として表示するネームスペースのオプション */
  namespaceOptions: string[] = [];

  /** 候補として表示するカラーのオプション */
  colorOptions: MaterialColor[] = MaterialColorOptions.colorOptions;

  /** 候補として表示するアドレスのオプション */
  addressOptions: string[] = [];

  /** 候補として表示するポートナンバーのオプション */
  portOptions: number[] = [];

  /**
   * オブジェクトを構築する
   */
  constructor() {}
}

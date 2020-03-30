/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import * as ROSLIB from 'roslib';
import { PickableModel } from '../../shared/pickable-model';

/**
 * ポーズです。
 */
export interface Pose extends PickableModel {
  /** ネーム */
  name: string;

  /** カラー */
  color: string;

  /** ポーズ */
  rospose: ROSLIB.Pose;
}

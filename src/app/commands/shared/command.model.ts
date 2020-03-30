/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { PickableModel } from '../../shared/pickable-model';
import { RoboCmd } from '../../shared/ros/messages/robo-cmd.model';

/**
 * コマンドです。
 */
export interface Command extends PickableModel {
  /** コマンド */
  command: RoboCmd;
}

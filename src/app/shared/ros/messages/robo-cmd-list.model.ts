/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { RoboCmd } from './robo-cmd.model';

/**
 * RoboCmdListメッセージです。
 */
export interface RoboCmdList {
  /** アイディー */
  id: string;

  /** コマンドリスト */
  cmdlist: RoboCmd[];

  /** パラメータアレイ */
  params: string[];
}

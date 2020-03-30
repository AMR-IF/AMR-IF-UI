/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * RoboCmdメッセージです。
 */
export interface RoboCmd {
  /** アイディー */
  id: string;

  /** コマンド */
  cmd: string;

  /** パラメータアレイ */
  params: string[];

  /** ネクストアイディー */
  nextid: string[];
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * RoboResメッセージです。
 */
export interface RoboRes {
  /** アイディー */
  id: string;

  /** コマンド */
  cmd: string;

  /** パラメータアレイ */
  params: string[];

  /** ネクストアイディー */
  nextid: string[];

  /** ステータス */
  status: string;
}

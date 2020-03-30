/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { RoboRes } from './robo-res.model';

/**
 * RoboResListメッセージです。
 */
export interface RoboResList {
  /** アイディー */
  id: string;

  /** レスポンスリスト */
  reslist: RoboRes[];

  /** ステータス */
  status: string;
}

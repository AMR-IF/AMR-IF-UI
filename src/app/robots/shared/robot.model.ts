/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { PickableModel } from '../../shared/pickable-model';

/**
 * ロボットです。
 */
export interface Robot extends PickableModel {
  /** ネーム */
  name: string;

  /** ネームスペース */
  namespace: string;

  /** カラー */
  color: string;

  /** アドレス */
  address: string;

  /** ポートナンバー */
  port: number;
}

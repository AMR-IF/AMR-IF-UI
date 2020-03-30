/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { PickableModel } from '../../shared/pickable-model';

/**
 * セッティングです。
 */
export interface Setting extends PickableModel {
  /** ネーム */
  name: string;

  /** バリュー */
  value: string;
}

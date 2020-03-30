/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { PickableModel } from '../pickable-model';

/**
 * ストレージモデルデータです。
 */
export interface StorageData<M extends PickableModel> {
  /** データアレイ */
  array: M[];

  /** ネクストId */
  nextId: number;
}

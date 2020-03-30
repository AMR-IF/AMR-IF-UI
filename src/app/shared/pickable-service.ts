/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * ピックアップ可能なサービスです。
 */
export interface PickableService<M> {
  /**
   * 指定したアイディーを持つモデルを取得する。
   *
   * @param id アイディー
   * @return モデル
   */
  getById(id: number): M | undefined;
}

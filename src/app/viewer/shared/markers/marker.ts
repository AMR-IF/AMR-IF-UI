/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * マーカーです。
 */
export interface Marker {
  /**
   * ビューが変化した際にアップデートする。
   */
  update(): void;

  /**
   * 表示する。
   */
  show(): void;

  /**
   * 非表示にする。
   */
  hide(): void;

  /**
   * 表示か非表示かを返却する。
   *
   * @return true(表示)/false(非表示)
   */
  isVisibled(): boolean;

  /**
   * 破棄する。
   */
  dispose(): void;

  /**
   * 削除する。
   */
  remove(): void;
}

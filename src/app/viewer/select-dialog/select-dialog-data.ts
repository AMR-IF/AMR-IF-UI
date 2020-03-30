/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * セレクトダイアログデータです。
 */
export interface SelectDialogData {
  /** タイトル */
  title: string;

  /** プレースホルダー */
  placeholder: string;

  /** オプション */
  options: string[];

  /** セレクト */
  selected: string;
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * インプットダイアログデータです。
 */
export interface InputDialogData {
  /** タイトル */
  title: string;

  /** プレースホルダー */
  placeholder: string;

  /** オプション */
  options: string[];

  /** インプット */
  inputed: string;
}

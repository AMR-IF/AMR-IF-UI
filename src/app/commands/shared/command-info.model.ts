/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * コマンドインフォです。
 */
export interface CommandInfo {
  /** タイプ */
  type: string;

  /** リクエストトピックネーム */
  request: string;

  /** レスポンストピックネーム */
  response: string;

  /** コマンド */
  cmd: string;

  /** パラメータカウント */
  paramCount: number;

  /** パラメータインデックス */
  paramIndex: number;

  /** パラメータ */
  param: string;

  /** オートコンプリート */
  autocomplete: string[];
}

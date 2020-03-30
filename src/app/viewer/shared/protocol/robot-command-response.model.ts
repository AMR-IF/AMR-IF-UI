/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * ロボットレスポンスパラメーターです。
 */
export interface RobotResponseParameter {
  /** ネーム */
  name: string;

  /** バリュー */
  values: string[];
}

/**
 * ロボットレスポンスステータスです。
 */
export interface RobotResponseStatus {
  /** ステータス */
  statuses: string[];
}

/**
 * ロボットレスポンスです。
 */
export interface RobotResponse {
  /** コマンド名 */
  cmd: string;

  /** パラメータ */
  params: RobotResponseParameter[];

  /** ステータス */
  status: RobotResponseStatus;
}

/**
 * ロボットコマンドレスポンスです。
 */
export interface RobotCommandResponse {
  /** トピック */
  topic: string;

  /** メッセージタイプ */
  messageType: string;

  /** メッセージ */
  messages: RobotResponse[];
}

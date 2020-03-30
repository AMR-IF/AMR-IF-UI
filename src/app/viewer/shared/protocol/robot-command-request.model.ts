/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * ロボットコマンドパラメーターです。
 */
export interface RobotCommandParameter {
  /** ネーム */
  name: string;

  /** バリュー */
  values: string[];
}

/**
 * ロボットコマンドです。
 */
export interface RobotCommand {
  /** コマンド名 */
  cmd: string;

  /** パラメータ */
  params: RobotCommandParameter[];
}

/**
 * ロボットコマンドリクエストです。
 */
export interface RobotCommandRequest {
  /** トピック */
  topic: string;

  /** メッセージタイプ */
  messageType: string;

  /** メッセージ */
  messages: RobotCommand[];
}

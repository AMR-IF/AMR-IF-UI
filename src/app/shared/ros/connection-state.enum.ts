/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * 接続ステートを定義する。
 */
export enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
  Disconnecting,
  Retrying
}

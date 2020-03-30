/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * GroupStateメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/msg/GroupState.html
 */
export interface GroupState {
  /** ネーム */
  name: string;

  /** ステート */
  state: boolean;

  /** アイディー */
  id: number;

  /** ペアレント */
  parent: number;
}

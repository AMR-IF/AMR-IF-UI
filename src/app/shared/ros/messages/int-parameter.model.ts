/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * IntParameterメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/msg/IntParameter.html
 */
export interface IntParameter {
  /** ネーム */
  name: string;

  /** バリュー */
  value: number;
}

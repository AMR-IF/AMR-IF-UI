/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * StrParameterメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/msg/StrParameter.html
 */
export interface StrParameter {
  /** ネーム */
  name: string;

  /** バリュー */
  value: string;
}

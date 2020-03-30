/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * DoubleParameterメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/msg/DoubleParameter.html
 */
export interface DoubleParameter {
  /** ネーム */
  name: string;

  /** バリュー */
  value: number;
}

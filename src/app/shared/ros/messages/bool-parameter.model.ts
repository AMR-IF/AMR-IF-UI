/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * BoolParameterメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/msg/BoolParameter.html
 */
export interface BoolParameter {
  /** ネーム */
  name: string;

  /** バリュー */
  value: boolean;
}

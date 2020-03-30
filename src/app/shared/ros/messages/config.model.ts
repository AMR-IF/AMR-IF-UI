/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BoolParameter } from './bool-parameter.model';
import { IntParameter } from './int-parameter.model';
import { StrParameter } from './str-parameter.model';
import { DoubleParameter } from './double-parameter.model';
import { GroupState } from './group-state.model';

/**
 * Configメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/msg/Config.html
 */
export interface Config {
  /** boolパラメータ配列 */
  bools: BoolParameter[];

  /** intパラメータ配列 */
  ints: IntParameter[];

  /** strパラメータ配列 */
  strs: StrParameter[];

  /** doubleパラメータ配列 */
  doubles: DoubleParameter[];

  /** groupsパラメータ配列 */
  groups: GroupState[];
}

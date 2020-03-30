/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { PickableModel } from '../../shared/pickable-model';
import { Command } from '../../commands/shared/command.model';

/**
 * コマンドリストです。
 */
export interface CmdList extends PickableModel {
  /** ネーム */
  name: string;

  /** モード(custom) */
  mode: string;

  /** コマンドリスト */
  commands: Command[];
}

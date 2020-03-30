/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Robot } from '../../../robots/shared/robot.model';

/**
 * プロトコルエージェントです。
 */
export interface ProtocolAgent {
  /**
   *  ロボットを取得する。
   *
   * @return ロボット
   */
  getRobot(): Robot;

  /**
   * トピックを取得する。
   *
   * @param options オプション
   * @return トピック
   */
  getTopic(options: any): ROSLIB.Topic | null;
}

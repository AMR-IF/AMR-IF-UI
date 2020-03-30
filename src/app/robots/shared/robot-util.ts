/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Robot } from './robot.model';

/**
 * ロボットユーティリティです。
 */
export class RobotUtil {
  /**
   * URLを取得する。
   *
   * @param robot ロボット
   * @return ロボットのURL
   */
  static getURL(robot: Robot): string {
    if (window.location.protocol === 'https:') {
      return 'wss://' + robot.address + ':' + robot.port;
    } else {
      return 'ws://' + robot.address + ':' + robot.port;
    }
  }
}

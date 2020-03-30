/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { RobotCommandRequest } from './robot-command-request.model';
import { RobotCommandResponse } from './robot-command-response.model';

/**
 * プロトコルです。
 */
export interface Protocol {
  /** タイプ */
  type: string;

  /** リクエスト */
  request: RobotCommandRequest;

  /** レスポンス */
  response: RobotCommandResponse;
}

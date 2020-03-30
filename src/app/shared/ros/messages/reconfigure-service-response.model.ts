/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Config } from './config.model';

/**
 * Reconfigureサービスのレスポンスメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/srv/Reconfigure.html
 */
export interface ReconfigureServiceResponse {
  /** コンフィグ */
  config: Config;
}

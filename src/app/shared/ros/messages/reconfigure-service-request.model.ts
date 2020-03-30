/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Config } from './config.model';

/**
 * Reconfigureサービスのリクエストメッセージです。
 *
 * @see http://docs.ros.org/kinetic/api/dynamic_reconfigure/html/srv/Reconfigure.html
 */
export interface ReconfigureServiceRequest {
  /** コンフィグ */
  config: Config;
}

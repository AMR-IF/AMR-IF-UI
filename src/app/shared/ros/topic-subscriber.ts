/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * トピックサブスクライバーです。
 */
export interface TopicSubscriber {
  /**
   * トピックをサブスクライブする。
   */
  subscribe(): void;

  /**
   * トピックをアンサブスクライブする。
   */
  unsubscribe(): void;
}

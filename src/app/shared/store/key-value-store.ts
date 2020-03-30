/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

/**
 * キーバリューストアです。
 */
export interface KeyValueStore {
  /**
   * イニシャライズする。
   *
   * @return プロミス
   */
  initialize(): Promise<void>;

  /**
   * キーのバリューをゲットする。
   *
   * @param key キー
   * @return プロミス
   */
  get(key: string): Promise<any>;

  /**
   * キーをリムーブする。
   *
   * @param key キー
   * @return プロミス
   */
  remove(key: string): Promise<void>;

  /**
   * キーにバリューをセットする。
   *
   * @param key キー
   * @param value バリュー
   * @return プロミス
   */
  set(key: string, value: string): Promise<void>;
}

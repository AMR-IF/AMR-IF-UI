/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { KeyValueStore } from './key-value-store';

/**
 * ローカルストレージストアです。
 */
export class LocalStorageStore implements KeyValueStore {
  /**
   * オブジェクトを構築する。
   */
  constructor() {}

  /**
   * イニシャライズする。
   *
   * @return プロミス
   */
  async initialize(): Promise<void> {}

  /**
   * キーのバリューをゲットする。
   *
   * @param key キー
   * @return プロミス
   */
  async get(key: string): Promise<any> {
    return localStorage.getItem(key);
  }

  /**
   * キーをリムーブする。
   *
   * @param key キー
   * @return プロミス
   */
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  /**
   * キーにバリューをセットする。
   *
   * @param key キー
   * @param value バリュー
   * @return プロミス
   */
  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }
}

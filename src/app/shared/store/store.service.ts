/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Injectable } from '@angular/core';
import { KeyValueStore } from './key-value-store';
import { LocalStorageStore } from './local-storage-store';
import { HttpClient } from '@angular/common/http';

/**
 * ストアサービスする。
 */
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  /** キーバリューストア */
  keyValueStore: KeyValueStore;

  /**
   * オブジェクトを構築する。
   *
   * @param http HTTPクライアント
   */
  constructor(public http: HttpClient) {
    this.keyValueStore = new LocalStorageStore();
  }

  /**
   * キーバリューストアを返す。
   *
   * @return キーバリューストア
   */
  getKeyValueStore(): KeyValueStore {
    return this.keyValueStore;
  }
}

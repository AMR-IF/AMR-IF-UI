/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { OnInit, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PickableModel } from '../pickable-model';
import { StorageService } from './storage-service';
import { KeyValueStore } from '../store/key-value-store';
import { StoreService } from '../store/store.service';

/**
 * ストレージの基底コンポーネントです。
 */
export abstract class StorageComponent<
  M extends PickableModel,
  S extends StorageService<M>
> implements OnInit, AfterViewInit, OnDestroy {
  /** サービス */
  abstract service: S;

  /** ストアサービス */
  abstract storeService: StoreService;

  /** レンダラー2 */
  abstract renderer2: Renderer2;

  /** ダウンロードプレフィックスネーム */
  abstract downloadPrefixName: string;

  /** サブスクリプション */
  subscription: Subscription;

  /** アレイ */
  array: M[] = [];

  /** 新規編集中データ */
  edit: M;

  /** ストレージキー */
  storageKey: string = 'amr-if-ui' + '-table-';

  /** キーバリューストア */
  keyValueStore: KeyValueStore;

  /**
   * オブジェクトを構築する。
   */
  constructor() {}

  /**
   * コンポーネントを初期化する。
   *
   * データソースをサブスクライブして変化があればデータソースをアップデートする。
   * フィルタリングの設定をする。
   */
  ngOnInit(): void {
    this.keyValueStore = this.storeService.getKeyValueStore();
    this.edit = this.service.getEmptyModel();

    this.array = this.service.getAll();
    this.subscription = this.service.getObservable().subscribe(data => {
      this.array = data.array;
    });
  }

  /**
   * コンポーネントのビューが初期化された後に処理を行う。
   */
  ngAfterViewInit(): void {
    this.keyValueStore.get(this.getStorageKey());
  }

  /**
   * コンポーネントを破棄する。
   *
   * データソースのサブスクリプションをアンサブスクライブする。
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * ストレージキーを取得する。
   *
   * @return ストレージキー
   */
  getStorageKey(): string {
    return this.storageKey + this.downloadPrefixName;
  }

  /**
   * フォームに入力された新規アイテムを追加する。
   *
   * 必須項目をチェックしてサービスでアイテムを追加し、フォームの値をクリアする。
   *
   * @return 追加されたかどうか
   */
  async add(): Promise<any> {
    if (!this.service.validate(this.edit)) {
      return false;
    }

    const newItem: M = this.service.getEmptyModel();
    Object.assign(newItem, this.edit);
    await this.service.add(newItem);

    // clear form
    Object.assign(this.edit, this.service.getEmptyModel());

    return true;
  }

  /**
   * データをファイルにエクスポートしてダウンロードする。
   */
  export(): void {
    const fileName = this.downloadPrefixName + '.json';
    const aElement = this.renderer2.createElement('a');
    const file = new Blob([this.service.getJSON()], {
      type: 'application/json'
    });
    const fileURL = window.URL.createObjectURL(file);
    aElement.href = fileURL;
    aElement.download = fileName;
    aElement.click();
  }

  /**
   * データをファイルからインポートする。
   */
  async import(): Promise<void> {
    return new Promise(resolve => {
      const inputElement = this.renderer2.createElement('input');
      inputElement.type = 'file';
      inputElement.accept = 'application/json';
      const that = this;
      inputElement.addEventListener(
        'change',
        (event: any) => {
          const files = event.currentTarget.files;
          if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (() => {
              return (e: any) => {
                try {
                  const json = e.target.result;
                  that.service.restoreFromJSON(json);
                  that.service.store();
                } finally {
                  resolve();
                }
              };
            })();
            reader.readAsText(file);
          } else {
            resolve();
          }
        },
        false
      );
      inputElement.click();
    });
  }

  /**
   * データをクリアする。
   */
  async clear(): Promise<void> {
    await this.service.clear();
  }
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Subject, Observable } from 'rxjs';
import { StorageService } from './storage-service';
import { PickableModel } from '../pickable-model';
import { StorageData } from './storage-data';
import { KeyValueStore } from '../store/key-value-store';

/**
 * ストレージの基底クラスです。
 */
export abstract class BaseStorage<M extends PickableModel>
  implements StorageService<M> {
  /** ストレージキー */
  storageKey: string;

  /** データ */
  data: StorageData<M>;

  /** データサブジェクト */
  dataSubject: Subject<StorageData<M>> = new Subject();

  /** オブザーバブルデータ */
  observableData: Observable<StorageData<M>> = this.dataSubject.asObservable();

  /** キーバリューストア */
  keyValueStore: KeyValueStore;

  /**
   * オブジェクトを構築する。
   *
   * @param storageKey ストレージキー
   */
  constructor(storageKey: string, keyValueStore: KeyValueStore) {
    this.storageKey = storageKey;
    this.keyValueStore = keyValueStore;
  }

  /**
   * 初期データを生成して返却する。
   *
   * @return  初期データ
   */
  getInitialData(): StorageData<M> {
    return { array: [], nextId: 0 } as StorageData<M>;
  }

  /**
   * 初期化する。
   *
   * @return プロミス
   */
  async initialize(): Promise<boolean> {
    await this.keyValueStore.initialize();
    this.data = this.getInitialData();

    return await this.restoreFromStorage();
  }

  /**
   * ストレージからデータをリストアする。
   *
   * @return プロミス
   */
  async restoreFromStorage(): Promise<boolean> {
    const value = await this.keyValueStore.get(this.storageKey);
    if (value !== null) {
      this.restoreFromJSON(value);
      return true;
    }
    return false;
  }

  /**
   * JOSNからデータをリストアする。
   *
   * @param json JSON文字列
   */
  restoreFromJSON(json: string): void {
    this.restoreFromObject(JSON.parse(json));
  }

  /**
   * オブジェクトからデータをリストアする。
   *
   * @param object オブジェクト
   */
  restoreFromObject(object: any): void {
    this.data = object || this.getInitialData();
    this.notify();
  }

  /**
   * データをクリアする。
   *
   * @return プロミス
   */
  async clear(): Promise<void> {
    // remove all
    if (this.data && this.data.array) {
      for (const element of this.data.array) {
        await this.remove(element);
      }
    }
    this.data = this.getInitialData();
    await this.store();
    this.notify();
  }

  /**
   * データをストレージにストアする。
   *
   * @return プロミス
   */
  async store(): Promise<void> {
    await this.keyValueStore.set(this.storageKey, JSON.stringify(this.data));
    this.notify();
  }

  /**
   * 指定したアイディーを持つモデルを取得する。
   *
   * @param id アイディー
   * @return モデル
   */
  getById(id: number): M | undefined {
    return this.data.array.find(element => element.id === id);
  }

  /**
   * 全てのデータを取得する。
   *
   * @return 全てのデータ
   */
  getAll(): M[] {
    if (typeof this.data === 'undefined') {
      this.data = this.getInitialData();
    }
    return this.data.array;
  }

  /**
   * 対象モデルをデータに追加する。
   *
   * @param model 対象モデル
   */
  async add(model: M): Promise<void> {
    model.id = this.data.nextId++;
    this.data.array.push(model);
    await this.store();
  }

  /**
   * 対象モデルをセットする。
   *
   * @param array 対象モデルアレイ
   */
  async setArray(array: M[]): Promise<void> {
    this.clear();

    const that = this;
    array.forEach(element => {
      element.id = that.data.nextId++;
      that.data.array.push(element);
    });
    await this.store();
  }

  /**
   * 対象モデルを指定位置モデルの前に追加する。
   *
   * @param model 対象モデル
   * @param pos 位置モデル
   */
  async insertPrev(model: M, pos: M): Promise<void> {
    model.id = this.data.nextId++;
    const index = this.indexOf(pos);
    this.data.array.splice(index, 0, model);
    await this.store();
  }

  /**
   * 対象モデルを指定位置モデルの後に追加する。
   *
   * @param model 対象モデル
   * @param pos 位置モデル
   */
  async insertNext(model: M, pos: M): Promise<void> {
    model.id = this.data.nextId++;
    const index = this.indexOf(pos) + 1;
    this.data.array.splice(index, 0, model);
    await this.store();
  }

  /**
   * 対象モデルのインデックスを取得する。
   *
   * @param model 対象モデル
   * @return インデックス
   */
  indexOf(model: M): number {
    return this.data.array.indexOf(model);
  }

  /**
   * 対象モデルを次の位置に移動する。
   *
   * @param model 対象モデル
   */
  async moveNext(model: M): Promise<void> {
    const fromIndex = this.indexOf(model);
    const toIndex = fromIndex + 1;
    await this.move(fromIndex, toIndex);
  }

  /**
   * 対象モデルを次の位置に移動する。
   *
   * @param model 対象モデル
   */
  async movePrev(model: M): Promise<void> {
    const fromIndex = this.indexOf(model);
    const toIndex = fromIndex - 1;
    await this.move(fromIndex, toIndex);
  }

  /**
   * 対象モデルをフロムインデックスからトゥーインデックスに移動する。
   *
   * @param fromIndex フロムインデックス
   * @param toIndex トゥーインデックス
   */
  async move(fromIndex: number, toIndex: number): Promise<void> {
    if (this.isValidIndex(fromIndex) && this.isValidIndex(toIndex)) {
      const model = this.data.array[fromIndex];
      this.data.array.splice(fromIndex, 1);
      this.data.array.splice(toIndex, 0, model);
      await this.store();
    }
  }

  /**
   * 対象モデルを次の位置に移動する。
   *
   * @param index 対象モデル
   */
  isValidIndex(index: number): boolean {
    return 0 <= index && index < this.data.array.length;
  }

  /**
   * 対象モデルをデータから削除する。
   *
   * @param model 対象モデル
   * @return 削除の成否
   */
  async remove(model: M): Promise<boolean> {
    this.data.array = this.data.array.filter(
      element => element.id !== model.id
    );
    await this.store();
    return true;
  }

  /**
   * データのオブザーバブルを取得する。
   *
   * @return データのオブザーバブル
   */
  getObservable(): Observable<StorageData<M>> {
    return this.observableData;
  }

  /**
   * データの変更を通知する。
   */
  notify(): void {
    this.dataSubject.next(this.data);
  }

  /**
   * データのJSONを取得する。
   *
   * @return データのJSON
   */
  getJSON(): string {
    return JSON.stringify(this.data, undefined, 2);
  }

  /**
   * ソースモデルをターゲットモデルにアサインする。
   *
   * @param target ターゲットモデル
   * @param source ソースモデル
   */
  assign(target: M, source: M): void {
    Object.assign(target, source);
  }

  /**
   * エラーメッセージを表示する。
   *
   * @param message メッセージ
   */
  showErrorMessage(message: string): void {
    console.log(message);
  }

  /**
   * 空のモデルを取得する。
   *
   * @return 空のモデル
   */
  abstract getEmptyModel(): M;

  /**
   * バリデートする。
   *
   * @param edit エディットされたモデル
   * @return バリデートリザルト
   */
  abstract validate(edit: M): boolean;
}

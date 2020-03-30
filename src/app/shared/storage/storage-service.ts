/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Observable } from 'rxjs';
import { PickableService } from '../pickable-service';
import { PickableModel } from '../pickable-model';
import { StorageData } from './storage-data';

/**
 * ストレージサービスです。
 */
export interface StorageService<M extends PickableModel>
  extends PickableService<M> {
  /**
   * 初期データを生成して返却する。
   *
   * @return  初期データ
   */
  getInitialData(): StorageData<M>;

  /**
   * 初期化する。
   *
   * @return プロミス
   */
  initialize(): Promise<boolean>;

  /**
   * ストレージからデータをリストアする。
   *
   * @return プロミス
   */
  restoreFromStorage(): Promise<boolean>;

  /**
   * JOSNからデータをリストアする。
   *
   * @param json JSON文字列
   */
  restoreFromJSON(json: string): void;

  /**
   * オブジェクトからデータをリストアする。
   *
   * @param object オブジェクト
   */
  restoreFromObject(object: any): void;

  /**
   * データをクリアする。
   *
   * @return プロミス
   */
  clear(): Promise<void>;

  /**
   * 関連データとデータをストレージにストアする。
   *
   * @return プロミス
   */
  store(): Promise<void>;

  /**
   * 全てのデータを取得する。
   *
   * @return 全てのデータ
   */
  getAll(): M[];

  /**
   * 対象モデルをデータに追加する。
   *
   * @param model 対象モデル
   * @return プロミス
   */
  add(model: M): Promise<void>;

  /**
   * 対象モデルをデータから削除する。
   *
   * @param model 対象モデル
   * @return プロミス
   */
  remove(model: M): Promise<boolean>;

  /**
   * データのオブザーバブルを取得する。
   *
   * @return データのオブザーバブル
   */
  getObservable(): Observable<StorageData<M>>;

  /**
   * データの変更を通知する。
   */
  notify(): void;

  /**
   * データのJSONを取得する。
   *
   * @return データのJSON
   */
  getJSON(): string;

  /**
   * ソースモデルをターゲットモデルにアサインする。
   *
   * @param target ターゲットモデル
   * @param source ソースモデル
   */
  assign(target: M, source: M): void;

  /**
   * 空のモデルを取得する。
   *
   * @return 空のモデル
   */
  getEmptyModel(): M;

  /**
   * バリデートする。
   *
   * @param edit エディットされたモデル
   * @return バリデートリザルト
   */
  validate(edit: M): boolean;
}

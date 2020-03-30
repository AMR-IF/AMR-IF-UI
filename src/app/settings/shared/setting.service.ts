/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Injectable } from '@angular/core';
import { BaseStorage } from '../../shared/storage/base-storage';
import { Setting } from './setting.model';
import { StoreService } from '../../shared/store/store.service';

/**
 * セッティングサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class SettingService extends BaseStorage<Setting> {
  /** ストレージキー */
  static readonly STORAGE_KEY = 'amr-if-ui' + '-settings';

  /**
   * オブジェクトを構築する。
   *
   * @param storeService ストアサービス
   */
  constructor(
    public storeService: StoreService
  ) {
    super(SettingService.STORAGE_KEY, storeService.getKeyValueStore());
  }

  /**
   * 空のモデルを取得する。
   *
   * @return 空のモデル
   */
  getEmptyModel(): Setting {
    return {
      name: '',
      value: ''
    } as Setting;
  }

  /**
   * バリデートする。
   *
   * @param edit エディットされたモデル
   * @return バリデートリザルト
   */
  validate(edit: Setting): boolean {
    // check empty fields
    if (!edit.name) {
      this.showErrorMessage('Failed validation. The name field is required.');
      return false;
    }
    if (!edit.value) {
      this.showErrorMessage('Failed validation. The value field is required.');
      return false;
    }
    return true;
  }

  /**
   * 指定したネームが存在する場合はその値を返却し、存在しない場合は指定したデフォルト値を返却する。
   *
   * @param name ネーム
   * @param defaultValue デフォルト値
   */
  getValue(name: string, defaultValue: string): string {
    let value = defaultValue;
    this.data.array
      .filter(element => element.name === name)
      .forEach(element => {
        value = element.value;
      });
    return value;
  }

  /**
   * セッティングが存在しない場合は追加する。
   *
   * @param setting セッティング
   */
  async addIfNotExist(setting: Setting): Promise<void> {
    const filtered = this.data.array.filter(
      element => element.name === setting.name
    );
    if (filtered.length === 0) {
      await this.add(setting);
    }
  }

  /**
   * セッティングを追加する。
   */
  async addSettings(): Promise<void> {
    await this.addIfNotExist({
      name: 'resolution',
      value: '100'
    } as Setting);

    await this.addIfNotExist({
      name: 'fontSize',
      value: '32'
    } as Setting);

    await this.addIfNotExist({
      name: 'poseMarkerSize',
      value: '48'
    } as Setting);

    await this.addIfNotExist({
      name: 'rotation',
      value: '1'
    } as Setting);
  }

  /**
   * getValueをコールして戻り値を浮動小数点の数値としてパースして返却する。
   *
   * @param name ネーム
   * @param defaultValue デフォルト値
   */
  getNumber(name: string, defaultValue: string): number {
    const value = this.getValue(name, defaultValue);
    return parseFloat(value);
  }

  /**
   * レゾリューションを取得する。
   *
   * @return レゾリューション(デフォルトは100)
   */
  getResolution(): number {
    const value = this.getNumber('resolution', '100');
    return value;
  }

  /**
   * フォントサイズを取得する。
   *
   * @return フォントサイズ(デフォルトは32)
   */
  getFontSize(): number {
    const value = this.getNumber('fontSize', '32');
    return value;
  }

  /**
   * ポーズマーカーサイズを取得する。
   *
   * @return ポーズマーカーサイズ(デフォルトは48)
   */
  getPoseMarkerSize(): number {
    const value = this.getNumber('poseMarkerSize', '48');
    return value;
  }

  /**
   * ローテーション取得する。
   *
   * @return ローテーション(デフォルトは1)
   */
  getRotation(): number {
    let value = this.getNumber('rotation', '1');
    if (value < 0 || value > 3) {
      value = 0;
    }
    return value;
  }
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Injectable } from '@angular/core';
import { Robot } from './robot.model';
import { BaseStorage } from '../../shared/storage/base-storage';
import { StoreService } from '../../shared/store/store.service';

/**
 * ロボットサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class RobotService extends BaseStorage<Robot> {
  /** ストレージキー */
  static readonly STORAGE_KEY = 'amr-if-ui' + '-robots';

  /**
   * オブジェクトを構築する。
   *
   * @param storeService ストアサービス
   */
  constructor(
    public storeService: StoreService
  ) {
    super(RobotService.STORAGE_KEY, storeService.getKeyValueStore());
  }

  /**
   * 空のモデルを取得する。
   *
   * @return 空のモデル
   */
  getEmptyModel(): Robot {
    return {
      name: '',
      namespace: '',
      color: '',
      address: '',
      port: 9090
    } as Robot;
  }

  /**
   * バリデートする。
   *
   * @param edit エディットされたモデル
   * @return バリデートリザルト
   */
  validate(edit: Robot): boolean {
    // check empty fields
    if (!edit.name) {
      this.showErrorMessage('Failed validation. The name field is required.');
      return false;
    }
    if (!edit.namespace) {
      this.showErrorMessage('Failed validation. The namespace field is required.');
      return false;
    }
    if (!edit.color) {
      this.showErrorMessage('Failed validation. The color field is required.');
      return false;
    }
    if (!edit.address) {
      this.showErrorMessage('Failed validation. The address field is required.');
      return false;
    }
    if (edit.port == null) {
      this.showErrorMessage('Failed validation. The port field is required.');
      return false;
    }
    if (edit.port < 0 || 65535 < edit.port) {
      this.showErrorMessage('Failed validation. The port is out of range.');
      return false;
    }
    const regexColor = new RegExp(/^[#]{1}[0-9a-fA-F]{8}$/);
    if (!regexColor.test(edit.color)) {
      this.showErrorMessage('Failed validation. The color value is invalid.');
      return false;
    }
    const unique = this.getByName(edit.name);
    if (unique) {
      if (unique.id !== edit.id) {
        this.showErrorMessage('Failed validation. The same name already exists.');
        return false;
      }
    }

    return true;
  }

  /**
   * ネームが一致するデータを取得する。
   *
   * @param name ネーム
   * @return ネームが一致するデータ
   */
  getByName(name: string): Robot | undefined {
    return this.getAll().find(element => element.name === name);
  }

  /**
   * ロボットを取得する。
   *
   * @return ロボットオプション
   */
  getRobots(): string[] {
    const robots: string[] = [];
    this.getAll().forEach(robot => robots.push(robot.name));
    return robots;
  }
}

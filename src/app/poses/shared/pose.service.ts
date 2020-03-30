/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import * as ROSLIB from 'roslib';
import { Injectable } from '@angular/core';
import { Pose } from './pose.model';
import { BaseStorage } from '../../shared/storage/base-storage';
import { StoreService } from '../../shared/store/store.service';

/**
 * ポーズサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class PoseService extends BaseStorage<Pose> {
  /** ストレージキー */
  static readonly STORAGE_KEY = 'amr-if-ui' + '-poses';

  /**
   * オブジェクトを構築する。
   *
   * @param storeService ストアサービス
   */
  constructor(
    public storeService: StoreService
  ) {
    super(PoseService.STORAGE_KEY, storeService.getKeyValueStore());
  }

  /**
   * 空のモデルを取得する。
   *
   * @return 空のモデル
   */
  getEmptyModel(): Pose {
    return {
      name: '',
      rospose: {
        position: { x: 0, y: 0, z: 0 },
        orientation: { x: 0, y: 0, z: 0, w: 1 }
      } as ROSLIB.Pose,
      color: ''
    } as Pose;
  }

  /**
   * バリデートする。
   *
   * @param edit エディットされたモデル
   * @return バリデートリザルト
   */
  validate(edit: Pose): boolean {
    // check empty fields
    if (!edit.name) {
      this.showErrorMessage('Failed validation. The name field is required.');
      return false;
    }
    if (
      edit.rospose.position.x == null ||
      edit.rospose.position.y == null ||
      edit.rospose.position.z == null
    ) {
      this.showErrorMessage('Failed validation. The position field is required.');
      return false;
    }
    if (
      edit.rospose.orientation.x == null ||
      edit.rospose.orientation.y == null ||
      edit.rospose.orientation.z == null ||
      edit.rospose.orientation.w == null
    ) {
      this.showErrorMessage('Failed validation. The orientation field is required.');
      return false;
    }
    if (!edit.color) {
      this.showErrorMessage('Failed validation. The color field is required.');
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
  getByName(name: string): Pose | undefined {
    return this.getAll().find(element => element.name === name);
  }
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import * as ROSLIB from 'roslib';

// add type definition

declare module 'roslib' {
  /**
   * ポーズです。
   * roslibで型定義が宣言されていないので追加する。
   */
  export class Pose {
    /**
     * オブジェクトを構築する。
     *
     * @param options オプション
     */
    constructor(options: { position: any; orientation: any });

    /** ポジション */
    position: ROSLIB.Vector3;

    /** オリエンテーション */
    orientation: ROSLIB.Quaternion;

    /**
     * トランスフォームをアプライする。
     *
     * @param tf tf
     */
    applyTransform(tf: { rotation: any }): void;

    /**
     * クローンする。
     */
    clone(): void;
  }
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { BaseViewer } from '../base-viewer';
import { RosMarker } from './ros-marker';

/**
 * オリエンテーションマーカーです。
 */
export class OrientationMarker extends RosMarker {
  /** ロボットワールドコンテナ */
  robotWorld: PIXI.Container;

  /** スケーリングロボットワールドコンテナ */
  robotWorldScale: PIXI.Container;

  /** ポーズ */
  rospose: ROSLIB.Pose;

  /** X座標の値 */
  offsetx = 0;

  /** Y座標の値 */
  offsety = 0;

  /** 角度 */
  offsettheta = 0;

  /**
   * オブジェクトを構築する。
   *
   * ロボットワールドコンテナをRosワールドコンテナに追加する。
   * スケーリングロボットワールドコンテナをスケーリングRosワールドコンテナに追加する。
   *
   * コンテナの親子関係
   * Viewer.root -> BaseMarker.root
   * Viewer.rosWorld -> RosMarker.rosWorld -> OrientationMarker.robotWorld
   * Viewer.rosWorldScale -> RosMarker.rosWorldScale -> OrientationMarker.robotWorldScale
   *
   * @param viewer ビューワー
   */
  constructor(viewer: BaseViewer) {
    super(viewer);
    this.robotWorld = new PIXI.Container();
    this.rosWorld.addChild(this.robotWorld);
    this.robotWorldScale = new PIXI.Container();
    this.rosWorldScale.addChild(this.robotWorldScale);
  }

  /**
   * ポーズを設定し、オフセットを構築して設定し、ロボットワールドをアップデートする。
   *
   * @param rospose ポーズ
   */
  setRosPose(rospose: ROSLIB.Pose): void {
    if (rospose != null) {
      this.rospose = rospose;

      const poseX = rospose.position.x;
      const poseY = rospose.position.y;

      const q0 = rospose.orientation.w;
      const q1 = rospose.orientation.x;
      const q2 = rospose.orientation.y;
      const q3 = rospose.orientation.z;
      const poseTheta = Math.atan2(
        2 * (q0 * q3 + q1 * q2),
        1 - 2 * (q2 * q2 + q3 * q3)
      );

      this.setOffset(poseX, poseY, poseTheta);
      this.updateContainer();
    }
  }

  /**
   * オフセットをセットする。
   *
   * @param x X座標の値
   * @param y Y座標の値
   * @param theta 角度
   */
  setOffset(x: number, y: number, theta: number): void {
    this.offsetx = x;
    this.offsety = y;
    this.offsettheta = theta;
  }

  /**
   * 現在のオフセットでコンテナをアップデートする。
   *
   * ルートコンテナの原点をオフセット位置(Ros座標からスクリーン座標に変換)に変更する。
   * Rosワールドコンテナの原点をオフセット位置(スケーリングではないためレゾリューションで位置を算出)に変更する。
   * スケーリングRosワールドコンテナの原点をオフセット位置に変更する。
   *
   * ルートコンテナは回転させない。(主にテキスト表示に使用するため)
   * スケーリングRosワールドコンテナ。
   */
  updateContainer(): void {
    // for screen
    const rosPoint = new PIXI.Point(this.offsetx, this.offsety);
    const screenPoint = this.viewer.rosToScreen(rosPoint);
    this.root.x = screenPoint.x;
    this.root.y = screenPoint.y;

    // set ros position
    this.rosWorld.x = this.offsetx * this.viewer.resolution;
    this.rosWorld.y = this.offsety * this.viewer.resolution;
    this.rosWorldScale.x = this.offsetx;
    this.rosWorldScale.y = this.offsety;

    // set robot direction
    this.robotWorld.rotation = this.offsettheta;
    this.robotWorldScale.rotation = this.offsettheta;
  }

  /**
   * ビューが変化した際にアップデートする。
   *
   * コンテナをアップデートする。
   */
  update(): void {
    super.update();
    this.updateContainer();
  }

  /**
   * 表示する。
   *
   * ロボットワールドコンテナを表示する。
   * スケーリングロボットワールドコンテナを表示する。
   */
  show(): void {
    super.show();
    this.robotWorld.visible = true;
    this.robotWorldScale.visible = true;
  }

  /**
   * 非表示にする。
   *
   * ロボットワールドコンテナを非表示にする。
   * スケーリングロボットワールドコンテナを非表示にする。
   */
  hide(): void {
    super.hide();
    this.robotWorld.visible = false;
    this.robotWorldScale.visible = false;
  }

  /**
   * 削除する。
   *
   * ロボットワールドコンテナをRosワールドコンテナから削除にする。
   * スケーリングロボットワールドコンテナをスケーリングRosワールドコンテナから削除にする。
   */
  remove(): void {
    super.remove();
    this.rosWorld.removeChild(this.robotWorld);
    this.rosWorldScale.removeChild(this.robotWorldScale);
  }
}

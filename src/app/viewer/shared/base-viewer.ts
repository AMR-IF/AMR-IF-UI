/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Observable } from 'rxjs';
import { BaseViewerComponent } from './base-viewer-component';
import { Viewer } from './viewer';
import { Marker } from './markers/marker';
import { RobotMarker } from './markers/robot-marker';
import { Robot } from '../../robots/shared/robot.model';
import { ControlMarker } from './markers/control-marker';

/**
 * ベースビューアーです。
 */
export interface BaseViewer {
  /** ルート */
  root: PIXI.Container;

  /** Rosワールド */
  rosWorld: PIXI.Container;

  /** Rosワールドスケール */
  rosWorldScale: PIXI.Container;

  /** コントロールマーカー */
  controlMarker: ControlMarker;

  /** レゾリューション[pixel/m] */
  resolution: number;

  /** ビューウィドゥス */
  viewWidth: number;

  /** ビューハイト */
  viewHeight: number;

  /** マップグループ */
  mapsGroup: PIXI.display.Group;

  /** グリッドグループ */
  gridGroup: PIXI.display.Group;

  /** ポーズグループ */
  posesGroup: PIXI.display.Group;

  /** ロボットグループ */
  robotsGroup: PIXI.display.Group;

  /** コントロールグループ */
  controlGroup: PIXI.display.Group;

  /**
   * ビューワーをゲットする。
   */
  getViewer(): BaseViewer;

  /**
   * コンポーネントをゲットする。
   *
   * @return コンポーネント
   */
  getComponent(): BaseViewerComponent;

  /**
   * オブザーバブルビューを取得する。
   *
   * @return オブザーバブルビュー
   */
  getObservableViwer(): Observable<Viewer>;

  /**
   * マーカーを追加する。
   *
   * @param marker マーカー
   */
  addMarker(marker: Marker): void;

  /**
   * マーカーを削除する。
   *
   * @param marker マーカー
   */
  removeMarker(marker: Marker): void;

  /**
   * ロボットマーカーを取得する。
   *
   * @param robot ロボット
   */
  getRobotMarker(robot: Robot): RobotMarker | undefined;

  /**
   * コントロールマーカーを表示する。
   *
   * @param robotMarker ロボットマーカー
   */
  showControlMarker(robotMarker: RobotMarker): void;

  /**
   * ビューの角度を取得する。
   *
   * @return ビューの角度
   */
  getRotationRadian(): number;

  /**
   * Ros座標系のポイントをスクリーン座標系のポイントに変換する。
   *
   * @param rosPoint Ros座標系のポイント
   * @return スクリーン座標系のポイント
   */
  rosToScreen(rosPoint: PIXI.Point): PIXI.Point;
}

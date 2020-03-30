/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import 'pixi-layers';
import { Subject, Observable } from 'rxjs';
import { BaseViewerComponent } from './base-viewer-component';
import { BaseViewer } from './base-viewer';
import { Marker } from './markers/marker';
import { GridMarker } from './markers/grid-marker';
import { RobotMarker } from './markers/robot-marker';
import { MapMarker } from './markers/map-marker';
import { PoseMarker } from './markers/pose-marker';
import { ControlMarker } from './markers/control-marker';
import { ViewerState } from './viewer-state';
import { TopicSubscriber } from '../../shared/ros/topic-subscriber';
import { Robot } from '../../robots/shared/robot.model';
import { Pose } from '../../poses/shared/pose.model';

/**
 * ビューワーです。
 */
export class Viewer implements BaseViewer {
  /** コンポーネント */
  component: BaseViewerComponent;

  /** サブジェクト */
  viewerSubject: Subject<Viewer> = new Subject();

  /** オブザーバブルビューワー */
  observableViewer: Observable<Viewer> = this.viewerSubject.asObservable();

  /** ビューデータ */
  state: ViewerState = new ViewerState();

  /** アプリケーション */
  app: PIXI.Application;

  /** ルート */
  root: PIXI.Container;

  /** ルートスケール(ズーム用) */
  rootScale: PIXI.Container;

  /** ワールド */
  world: PIXI.Container;

  /** Rosワールドベース */
  rosWorldBase: PIXI.Container;

  /** Rosワールドオリジン */
  rosWorldOrigin: PIXI.Container;

  /** Rosワールド */
  rosWorld: PIXI.Container;

  /** Rosワールドスケール */
  rosWorldScale: PIXI.Container;

  /** マックススケール */
  maxScale = 100.0;

  /** ミニマムスケール */
  minScale = 0.001;

  /** バックグラウンドカラー(RVizを参考) */
  backgroundColor = 0x707070;

  /** マーカーアレイ */
  markers: Marker[] = [];

  /** サブスクライバーアレイ */
  subscribers: TopicSubscriber[] = [];

  /** ロボットマーカーアレイ */
  robotMarkers: RobotMarker[] = [];

  /** マップマーカーアレイ */
  mapMarkers: MapMarker[] = [];

  /** ポーズマーカーアレイ */
  poseMarkers: PoseMarker[] = [];

  /** コントロールマーカー */
  controlMarker: ControlMarker;

  /** グリッドマーカー */
  gridMarker: GridMarker;

  /** レゾリューション[pixel/m] */
  resolution = 100;

  /** divエレメント */
  div: HTMLDivElement;

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
   * オブジェクトを構築する。
   *
   * コンポーネントのdivエレメントにPIXIアプリを構築する。
   * グループを設定してZ方向のレイヤーを構築する。
   * コンテナで各種座標系を構築する。
   * マーカーを追加する。
   * サブスクライブを開始する。
   *
   * @param component コンポーネント
   */
  constructor(component: BaseViewerComponent) {
    this.component = component;
    this.div = this.component.getViewerElementRef().nativeElement;

    this.viewWidth = this.div.offsetWidth;
    this.viewHeight = this.div.offsetHeight;

    let type = 'WebGL';
    if (!PIXI.utils.isWebGLSupported()) {
      type = 'canvas';
    }
    PIXI.utils.sayHello(type);

    // default resolution 100 [pixel/m]
    this.resolution = this.component.getSettingService().getResolution();

    this.app = new PIXI.Application({
      width: this.viewWidth, // default: 800
      height: this.viewHeight, // default: 600
      antialias: true, // default: false
      transparent: false, // default: false
      resolution: 1 // default: 1
    });
    this.app.renderer.backgroundColor = this.backgroundColor;
    this.app.renderer.autoDensity = true;

    this.mapsGroup = new PIXI.display.Group(-2, false);
    this.gridGroup = new PIXI.display.Group(-1, false);
    this.posesGroup = new PIXI.display.Group(1, false);
    this.robotsGroup = new PIXI.display.Group(2, false);
    this.controlGroup = new PIXI.display.Group(3, false);

    // specify display list component
    this.app.stage = new PIXI.display.Stage();
    this.app.stage.addChild(new PIXI.display.Layer(this.mapsGroup));
    this.app.stage.addChild(new PIXI.display.Layer(this.gridGroup));
    this.app.stage.addChild(new PIXI.display.Layer(this.posesGroup));
    this.app.stage.addChild(new PIXI.display.Layer(this.robotsGroup));
    this.app.stage.addChild(new PIXI.display.Layer(this.controlGroup));

    // screen coordinates
    // top right corner
    this.root = new PIXI.Container();
    this.app.stage.addChild(this.root);

    this.rootScale = new PIXI.Container();
    this.root.addChild(this.rootScale);

    // world coordinates
    // bottom left corner
    // screen to world
    this.world = new PIXI.Container();
    this.world.setTransform(0, this.viewHeight, 1, -1, 0, 0, 0, 0, 0);
    this.rootScale.addChild(this.world);

    // center origin
    this.rosWorldOrigin = new PIXI.Container();
    this.rosWorldOrigin.position.x = this.viewWidth / 2;
    this.rosWorldOrigin.position.y = this.viewHeight / 2;
    this.updateRosOriginPosition();
    this.world.addChild(this.rosWorldOrigin);

    // rotation for ROS
    const rotation = this.getRotationRadian();
    this.rosWorldBase = new PIXI.Container();
    this.rosWorldBase.setTransform(0, 0, 1, 1, rotation, 0, 0, 0, 0);
    this.rosWorldOrigin.addChild(this.rosWorldBase);

    // ros coordinates
    // world to rosWorld
    this.rosWorld = new PIXI.Container();
    this.rosWorldBase.addChild(this.rosWorld);

    // scaling
    this.rosWorldScale = new PIXI.Container();
    this.rosWorldScale.scale.x = this.resolution;
    this.rosWorldScale.scale.y = this.resolution;
    this.rosWorld.addChild(this.rosWorldScale);

    // markers
    this.gridMarker = new GridMarker(this);
    this.gridMarker.show();
    this.controlMarker = new ControlMarker(this);
    this.controlMarker.hide();

    // add markers
    this.component.getPoseService()
      .getAll()
      .forEach(element => this.addPoseMarker(element));
    this.component.getRobotService()
      .getAll()
      .forEach(element => this.addRobotMarker(element));

    // start subscribe
    this.subscribe();
  }

  /**
   * ビューワーをゲットする。
   *
   * @return ビューワー
   */
  getViewer(): Viewer {
    return this;
  }

  /**
   * コンポーネントをゲットする。
   *
   * @return コンポーネント
   */
  getComponent(): BaseViewerComponent {
    return this.component;
  }

  /**
   * ビューのcanvasエレメントを返却する。
   *
   * @return ビューのcanvasエレメント
   */
  getView(): HTMLCanvasElement {
    return this.app.view;
  }

  /**
   * オブザーバブルビューを取得する。
   *
   * @return オブザーバブルビュー
   */
  getObservableViwer(): Observable<Viewer> {
    return this.observableViewer;
  }

  /**
   * サブスクライブする。
   */
  subscribe(): void {
    this.subscribers.forEach(element => element.subscribe());
  }

  /**
   * アンサブスクライブする。
   */
  unsubscribe(): void {
    this.subscribers.forEach(element => element.unsubscribe());
  }

  /**
   * 破棄する。
   */
  dispose(): void {
    this.markers.forEach(element => element.dispose());
  }

  /**
   * デストロイする。
   */
  destroy(): void {
    this.unsubscribe();
    this.dispose();
  }

  /**
   * マーカーを追加する。
   *
   * @param marker マーカー
   */
  addMarker(marker: Marker): void {
    if (marker instanceof RobotMarker) {
      this.robotMarkers.push(marker);
      this.subscribers.push(marker);
    } else if (marker instanceof MapMarker) {
      this.mapMarkers.push(marker);
      this.subscribers.push(marker);
    } else if (marker instanceof PoseMarker) {
      this.poseMarkers.push(marker);
    }
    // all markers
    this.markers.push(marker);
  }

  /**
   * マーカーを削除する。
   *
   * @param marker マーカー
   */
  removeMarker(marker: Marker): void {
    if (marker instanceof RobotMarker) {
      this.robotMarkers = this.robotMarkers.filter(element => element !== marker);
      this.subscribers = this.subscribers.filter(element => element !== marker);
    } else if (marker instanceof MapMarker) {
      this.mapMarkers = this.mapMarkers.filter(element => element !== marker);
      this.subscribers = this.subscribers.filter(element => element !== marker);
    } else if (marker instanceof PoseMarker) {
      this.poseMarkers = this.poseMarkers.filter(element => element !== marker);
    }
    // all markers
    this.markers = this.markers.filter(element => element !== marker);
  }

  /**
   * ロボットマーカーを追加する。
   *
   * @param robot ロボット
   * @return ロボットマーカー
   */
  addRobotMarker(robot: Robot): RobotMarker {
    const robotMarker = new RobotMarker(this, robot);
    return robotMarker;
  }

  /**
   * ロボットマーカーを取得する。
   *
   * @param robot ロボット
   */
  getRobotMarker(robot: Robot): RobotMarker | undefined {
    const robotMarker = this.robotMarkers.find(
      element => element.robot === robot
    );
    return robotMarker;
  }

  /**
   * ポーズマーカーを追加する。
   *
   * @param pose ポーズ
   * @return ポーズマーカー
   */
  addPoseMarker(pose: Pose): PoseMarker {
    const poseMarker = new PoseMarker(this);
    poseMarker.setPose(pose);
    return poseMarker;
  }

  /**
   * コントロールマーカーを表示する。
   *
   * @param robotMarker ロボットマーカー
   */
  showControlMarker(robotMarker: RobotMarker): void {
    this.controlMarker.updateControl(robotMarker);
  }

  /**
   * オリジンが中央になるようにビューをセットする。
   */
  setRosOriginToCenterOfView(): void {
    const x = this.viewWidth / 2;
    const y = this.viewHeight / 2;
    this.setRosOrigin(x, y);
  }

  /**
   * オリジンを指定位置にセットする。
   *
   * @param x X座標
   * @param y Y座標
   */
  setRosOrigin(x: number, y: number): void {
    this.state.originX = x;
    this.state.originY = y;

    this.rosWorldOrigin.position.x = 0;
    this.rosWorldOrigin.position.y = this.viewHeight;

    x /= this.state.scale;
    y /= this.state.scale;

    this.rosWorldOrigin.position.x += x;
    this.rosWorldOrigin.position.y -= y;
    this.updateRosOriginPosition();
  }

  /**
   * オリジンポジションを指定位置にセットする。
   *
   * @param x X座標
   * @param y Y座標
   */
  setRosOriginPosition(x: number, y: number): void {
    this.rosWorldOrigin.position.x = x;
    this.rosWorldOrigin.position.y = y;
    this.updateRosOriginPosition();
  }

  /**
   * オリジンポジションをアップデートする。
   */
  updateRosOriginPosition(): void {
    this.state.positionX = this.rosWorldOrigin.position.x;
    this.state.positionY = this.rosWorldOrigin.position.y;
  }

  /**
   * ズームをリセットする。
   */
  resetZoom(): void {
    this.setScale(1.0, true);
  }

  /**
   * スケールをセットする。
   *
   * @param scale スケール
   * @param keepPosition キープポジション
   */
  setScale(scale: number, keepPosition: boolean): void {
    if (this.minScale <= scale && scale <= this.maxScale) {
      if (keepPosition) {
        // (1/this.view.scale) - (1/scale) => (scale - this.view.scale) / (scale * this.view.scale)
        const factor = (scale - this.state.scale) / (scale * this.state.scale);
        const deltaWidth = factor * (this.viewWidth * 0.5);
        const deltaHeight = factor * (this.viewHeight * 0.5);
        this.rosWorldOrigin.position.x -= deltaWidth;
        this.rosWorldOrigin.position.y += deltaHeight;
        this.updateRosOriginPosition();
      }

      this.state.scale = scale;
      this.rootScale.scale.x = scale;
      this.rootScale.scale.y = scale;
    }
  }

  /**
   * ビューの角度を取得する。
   *
   * @return ビューの角度
   */
  getRotationRadian(): number {
    const rotation = this.component.getSettingService().getRotation();
    return rotation * (Math.PI / 2);
  }

  /**
   * ズームなしで原点が中央になるようにビューをリセットする。
   */
  resetView(): void {
    this.resetZoom();
    this.setRosOriginToCenterOfView();
  }

  /**
   * レゾリューションをセットする。
   *
   * @param resolution レゾリューション
   */
  setResolution(resolution: number): void {
    this.resolution = resolution;
    this.updateResolution();
  }

  /**
   * レゾリューションをアップデートする。
   *
   * ビューの変化をサブスクリプトしているオブジェクトに知らせる。
   */
  updateResolution(): void {
    this.rosWorldScale.scale.x = this.resolution;
    this.rosWorldScale.scale.y = this.resolution;
    this.viewerSubject.next(this);
  }

  /**
   * スクリーン座標系のポイントをRos座標系のポイントに変換する。
   *
   * @param screenPoint スクリーン座標系のポイント
   * @return Ros座標系のポイント
   */
  screenToRos(screenPoint: PIXI.Point): PIXI.Point {
    const rosPoint = this.rosWorldScale.worldTransform.applyInverse(screenPoint);
    return rosPoint;
  }

  /**
   * Ros座標系のポイントをスクリーン座標系のポイントに変換する。
   *
   * @param rosPoint Ros座標系のポイント
   * @return スクリーン座標系のポイント
   */
  rosToScreen(rosPoint: PIXI.Point): PIXI.Point {
    const screenPoint = this.rosWorldScale.worldTransform.apply(rosPoint);
    return screenPoint;
  }

  /**
   * リサイズイベントをハンドリングする。
   */
  onResize(): void {
    this.viewWidth = this.div.offsetWidth;
    this.viewHeight = this.div.offsetHeight;
    this.world.setTransform(0, this.viewHeight, 1, -1, 0, 0, 0, 0, 0);
    this.app.renderer.resize(this.viewWidth, this.viewHeight);
    this.viewerSubject.next(this);
  }

  /**
   * ステートをリストアする。
   */
  restoreState(): void {
    const positionX = this.state.positionX;
    const positionY = this.state.positionY;

    this.setScale(this.state.scale, false);
    this.setRosOrigin(this.state.originX, this.state.originY);
    this.setRosOriginPosition(positionX, positionY);
    this.viewerSubject.next(this);

    // The target RobotMarker has not restored yet when controlMarker is restored.
    this.controlMarker.updateCmdIcon();
  }

  /**
   * キーダウンイベントをハンドリングする。
   *
   * @param event イベント
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) {
      return; // Should do nothing if the default action has been cancelled
    }

    const code = event.code;
    let step = 100;
    let zoomStep = 0.1;
    if (event.shiftKey) {
      step /= 10;
      zoomStep /= 10;
    }

    let handled = true;
    if (code === 'ArrowUp') {
      this.rosWorldOrigin.position.y += step;
      this.updateRosOriginPosition();
    } else if (code === 'ArrowDown') {
      this.rosWorldOrigin.position.y -= step;
      this.updateRosOriginPosition();
    } else if (code === 'ArrowLeft') {
      this.rosWorldOrigin.position.x -= step;
      this.updateRosOriginPosition();
    } else if (code === 'ArrowRight') {
      this.rosWorldOrigin.position.x += step;
      this.updateRosOriginPosition();
    } else if (code === 'PageUp') {
      this.setScale(this.state.scale + zoomStep, true);
    } else if (code === 'PageDown') {
      this.setScale(this.state.scale - zoomStep, true);
    } else if (code === 'Home' || code === 'End') {
      this.resetView();
    } else {
      handled = false;
    }
    if (handled) {
      event.preventDefault();
    }
  }
}

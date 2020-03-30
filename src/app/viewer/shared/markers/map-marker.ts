/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { BaseViewer } from '../base-viewer';
import { RosMarker } from './ros-marker';
import { Robot } from '../../../robots/shared/robot.model';
import { OccupancyGrid } from '../../../shared/ros/messages/occupancy-grid.model';

/**
 * マップマーカーです。
 */
export class MapMarker extends RosMarker {
  /** ロボット */
  robot: Robot;

  /** トピックネーム */
  topicName: string;

  /** アルファ */
  alpha: number;

  /** ビジビリティ */
  visibility: boolean;

  /** canvasエレメント */
  canvas: HTMLCanvasElement;

  /** マップトピック */
  topic: ROSLIB.Topic | null;

  /** テクスチャー */
  texture: PIXI.Texture;

  /** コンテナ */
  container: PIXI.Container;

  /** ワールドローテーション */
  worldRotation: PIXI.Container;

  /** ワールド */
  world: PIXI.Container;

  /** ワールドオリジン */
  worldOrigin: PIXI.Container;

  /** スケール */
  scale: number;

  /** スプライト */
  sprite: PIXI.Sprite;

  /**
   * オブジェクトを構築する。
   *
   * ネームはトピック名をセットする。
   * マップ用のcanvasエレメントを追加する。
   * canvasに描画したものをテクスチャーとするスプライトを作成する。
   * ペアレントグループを設定することでマップは最後列に配置する。
   * マップの位置と大きさはRos座標系のデータなのでrosWorldScaleに追加する。
   *
   * @param viewer ビューワー
   * @param robot ロボット
   * @param topicName マップトピックネーム
   */
  constructor(
    viewer: BaseViewer,
    robot: Robot,
    topicName: string
  ) {
    super(viewer);
    this.robot = robot;
    this.topicName = topicName;
    this.canvas = this.viewer.getComponent().getRenderer2().createElement('canvas');
    this.viewer.getComponent().getRenderer2().appendChild(
      this.viewer.getComponent().getCanvasesPlaceholderElementRef().nativeElement,
      this.canvas
    );
    this.texture = PIXI.Texture.from(this.canvas);
    this.sprite = new PIXI.Sprite(this.texture);

    const mapAlpha = 1.0;
    this.setAlpha(mapAlpha);

    this.container = new PIXI.Container();
    this.container.parentGroup = this.viewer.mapsGroup;

    this.worldRotation = new PIXI.Container();
    this.world = new PIXI.Container();
    this.worldOrigin = new PIXI.Container();

    this.container.addChild(this.worldRotation);
    this.worldRotation.addChild(this.world);
    this.world.addChild(this.worldOrigin);
    this.worldOrigin.addChild(this.sprite);

    this.rosWorld.addChild(this.container);
  }

  /**
   * オキュパンシーグリッドのデータでcanvasにマップを描画してテキスチャをアップデートする。
   *
   * メタデータのオリジンにスプライトを移動する。
   * メタデータのレゾリューションでスケールを指定する。
   *
   * @param occupancyGrid オキュパンシーグリッド
   */
  redraw(occupancyGrid: OccupancyGrid): void {
    const occupiedColor = 0x000000;
    const freeColor = 0xffffff;
    const unknownColor = 0x5c6e6c;

    const resolution = occupancyGrid.info.resolution; // [m/cell]
    const width = occupancyGrid.info.width; // [cells]
    const height = occupancyGrid.info.height; // [cells]
    const origin = occupancyGrid.info.origin;
    const data = occupancyGrid.data;

    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext('2d');
    if (context != null) {
      const imageData = context.createImageData(width, height);
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const index = col + row * width;
          const cellData = data[index];
          let val;
          if (cellData === 100) {
            val = occupiedColor;
          } else if (cellData === 0) {
            val = freeColor;
          } else {
            val = unknownColor;
          }
          let i = index * 4;
          imageData.data[i] = (val >> 16) & 0xff;
          imageData.data[++i] = (val >> 8) & 0xff;
          imageData.data[++i] = (val >> 0) & 0xff;
          imageData.data[++i] = 255;
        }
      }
      context.putImageData(imageData, 0, 0);
    }
    this.sprite.texture.update();

    const q0 = origin.orientation.w;
    const q1 = origin.orientation.x;
    const q2 = origin.orientation.y;
    const q3 = origin.orientation.z;
    const originAngle = Math.atan2(
      2 * (q0 * q3 + q1 * q2),
      1 - 2 * (q2 * q2 + q3 * q3)
    );
    const cos = Math.cos(originAngle);
    const sin = Math.sin(originAngle);

    const originX = origin.position.x;
    const originY = origin.position.y;

    this.worldRotation.rotation = originAngle;

    this.scale = resolution * this.viewer.resolution;
    this.world.setTransform(0, 0, this.scale, this.scale, 0, 0, 0, 0, 0);

    const screenX = originX;
    const screenY = originY;

    const positionX = screenY * sin + screenX * cos;
    const positionY = screenY * cos - screenX * sin;

    this.worldOrigin.position.x =
      (positionX * this.viewer.resolution) / this.scale;
    this.worldOrigin.position.y =
      (positionY * this.viewer.resolution) / this.scale;
  }

  /**
   * トピックをサブスクライブする。
   */
  subscribe(): void {
    const that = this;

    if (this.topic == null) {
      this.topic = this.viewer.getComponent().getRosService().getTopic(this.robot, {
        name: this.robot.namespace + '/' + this.topicName,
        messageType: 'nav_msgs/OccupancyGrid',
        compression: 'png'
      });

      if (this.topic != null) {
        this.topic.subscribe((occupancyGrid: OccupancyGrid) => {
          that.redraw(occupancyGrid);
        });
      }
    }
  }

  /**
   * トピックをアンサブスクライブする。
   */
  unsubscribe(): void {
    if (this.topic != null) {
      this.topic.unsubscribe();
      this.topic = null;
    }
    this.clear();
  }

  /**
   * 削除する。
   *
   * 追加したcanvasエレメントを削除する。
   */
  remove(): void {
    super.remove();
    this.viewer.getComponent().getRenderer2().removeChild(
      this.viewer.getComponent().getCanvasesPlaceholderElementRef().nativeElement,
      this.canvas
    );
  }

  /**
   * クリアする。
   */
  clear(): void {
    const context = this.canvas.getContext('2d');
    if (context != null) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.sprite.texture.update();
  }

  /**
   * アルファをセットする。
   *
   * @param alpha アルファ
   */
  setAlpha(alpha: number): void {
    this.alpha = alpha;
    this.sprite.alpha = alpha;
  }

  /**
   * 表示する。
   */
  show(): void {
    super.show();
    this.subscribe();
    this.visibility = this.isVisibled();
  }

  /**
   * 非表示にする。
   */
  hide(): void {
    super.hide();
    this.unsubscribe();
    this.visibility = this.isVisibled();
  }

  /**
   * ステートからリストアにする。
   */
  restore(): void {
    this.setAlpha(this.alpha);
    if (this.visibility) {
      this.show();
    } else {
      this.hide();
    }
  }
}

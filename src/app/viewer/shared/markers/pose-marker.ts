/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { BaseViewer } from '../base-viewer';
import { OrientationMarker } from './orientation-marker';
import { TextMarker } from './text-marker';
import { Pose } from '../../../poses/shared/pose.model';
import { Robot } from '../../../robots/shared/robot.model';
import { TextPosition } from '../text-position.enum';

/**
 * ポーズマーカーです。
 */
export class PoseMarker extends OrientationMarker {
  /** ロボット */
  robot: Robot;

  /** サイズ */
  size: number;

  /** ストロークサイズ */
  strokeSize = 4;

  /** フィルカラー */
  fillColor = 0;

  /** アルファ */
  alpha = 0.5;

  /** フットプリントカラー */
  footprintColor = 0;

  /** ストローク */
  stroke = false;

  /** ストロークカラー */
  strokeColor = 0;

  /** パルス */
  pulse = false;

  /** グロウカウント */
  growCount = 0;

  /** グロウィング中かどうか */
  growing = true;

  /** テキストマーカー */
  textMarker: TextMarker;

  /** コンテナ */
  container: PIXI.Container;

  /** グラフィックスシェイプ */
  graphicsShape: PIXI.Graphics;

  /** ポーズ */
  pose: Pose;

  /** トピック */
  poseTopic: ROSLIB.Topic | null;

  /** タイムスタンプ */
  isStamped = true;

  /**
   * オブジェクトを構築する。
   *
   * ポーズをトライアングル形状でドローする。
   * サイズはセッティングの値を参照している。
   * パルスの有無やストロークの有無でバリエーションを指定できる。
   * テキストマーカーを保持しており、関連するテキストを表示する。
   *
   * @param viewer ビューワー
   */
  constructor(viewer: BaseViewer) {
    super(viewer);

    this.size = this.viewer.getComponent().getSettingService().getPoseMarkerSize();

    this.container = new PIXI.Container();
    this.graphicsShape = new PIXI.Graphics();
    this.container.addChild(this.graphicsShape);
    this.robotWorld.addChild(this.container);
    this.textMarker = new TextMarker(this.viewer);

    this.redraw();
  }

  /**
   * テキストポジションをセットする。
   *
   * @param pose ポーズ
   */
  setPose(pose: Pose): void {
    this.pose = pose;
    this.container.parentGroup = this.viewer.posesGroup;
    this.size = this.viewer.getComponent().getSettingService().getPoseMarkerSize();
    this.setColor(this.pose.color);
    this.setTextPosition(TextPosition.Left);
    this.setText(this.pose.name);
    this.setRosPose(this.pose.rospose);
  }

  /**
   * ロボットをセットする。
   *
   * @param robot ロボット
   */
  setRobot(robot: Robot): void {
    this.robot = robot;
  }

  /**
   * テキストポジションをセットする。
   *
   * @param position テキストポジション
   */
  setTextPosition(position: TextPosition): void {
    this.textMarker.setTextPosition(position);
  }

  /**
   * テキストをセットする。
   *
   * @param text テキスト
   */
  setText(text: string): void {
    this.textMarker.setText(text);
  }

  /**
   * パルスをセットする。
   *
   * @param pulse パルスの有無
   */
  setPulse(pulse: boolean): void {
    this.pulse = pulse;
  }

  /**
   * ストロークをセットする。
   *
   * @param stroke ストロークの有無
   */
  setStroke(stroke: boolean): void {
    this.stroke = stroke;
  }

  /**
   * カラーをセットする。
   *
   * アルファとテキストマーカーのフィルカラーもセットする。
   *
   * @param color カラー(#RRGGBBAA)
   */
  setColor(color: string): void {
    // #RRGGBBAA
    this.fillColor = parseInt(color.substring(1, 7), 16);
    this.alpha = parseInt(color.substring(7, 9), 16) / 255.0;
    this.textMarker.setFillColor(this.fillColor);
    this.redraw();
  }

  /**
   * パルスをアップデートする。
   */
  updatePulse(): void {
    if (this.pulse) {
      if (this.growing) {
        this.graphicsShape.scale.x *= 1.035;
        this.graphicsShape.scale.y *= 1.035;
        this.growing = ++this.growCount < 5;
      } else {
        this.graphicsShape.scale.x /= 1.035;
        this.graphicsShape.scale.y /= 1.035;
        this.growing = --this.growCount < 0;
      }
    }
  }

  /**
   * ポーズをセットする。
   *
   * @param rospose ポーズ
   */
  setRosPose(rospose: ROSLIB.Pose): void {
    super.setRosPose(rospose);
    this.textMarker.setRosPose(rospose);
    if (rospose != null) {
      this.updatePulse();
    }
    this.redraw();
  }

  /**
   * リドローする。
   */
  redraw(): void {
    const size = this.size;
    const g = this.graphicsShape;
    g.clear();

    // baseFootprintShape
    g.beginFill(this.footprintColor, this.alpha);
    g.drawCircle(0, 0, size / 8);

    // directionShape
    if (this.stroke) {
      g.lineStyle(this.strokeSize, this.strokeColor, this.alpha);
    } else {
      g.lineStyle(0);
    }
    g.beginFill(this.fillColor, this.alpha);
    g.moveTo(-size / 2.0, -size / 2.0);
    g.lineTo(size, 0);
    g.lineTo(-size / 2.0, size / 2.0);
    g.closePath();

    g.endFill();
  }

  /**
   * トピックをサブスクライブする。
   */
  subscribe(): void {
    const that = this;

    if (this.poseTopic == null) {
      const throttleRate = 100; // [msec]

      if (this.isStamped) {
        this.poseTopic = this.viewer.getComponent().getRosService().getTopic(this.robot, {
          name: this.robot.namespace + '/robot_pose',
          messageType: 'geometry_msgs/PoseStamped',
          throttle_rate: throttleRate
        });

        if (this.poseTopic != null) {
          this.poseTopic.subscribe((poseStamped: any) => {
            const pose = poseStamped.pose;
            that.setRosPose(pose);
          });
        }
      } else {
        this.poseTopic = this.viewer.getComponent().getRosService().getTopic(this.robot, {
          name: this.robot.namespace + '/robot_pose',
          messageType: 'geometry_msgs/Pose',
          throttle_rate: throttleRate
        });

        if (this.poseTopic != null) {
          this.poseTopic.subscribe((pose: ROSLIB.Pose) => {
            that.setRosPose(pose);
          });
        }
      }
    }
  }

  /**
   * トピックをアンサブスクライブする。
   */
  unsubscribe(): void {
    if (this.poseTopic != null) {
      this.poseTopic.unsubscribe();
      this.poseTopic = null;
    }
  }

  /**
   * 削除する。
   *
   * ローカルストレージからもプレイスを削除する。
   * テキストマーカーも削除する。
   */
  remove(): void {
    super.remove();
    this.viewer.getComponent().getPoseService().remove(this.pose);
    this.textMarker.remove();
  }

  /**
   * 表示する。
   *
   * テキストマーカーも表示する。
   */
  show(): void {
    super.show();
    this.textMarker.show();
  }

  /**
   * 非表示にする。
   *
   * テキストマーカーも非表示にする。
   */
  hide(): void {
    super.hide();
    this.textMarker.hide();
  }
}

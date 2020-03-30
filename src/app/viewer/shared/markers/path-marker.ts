/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { BaseViewer } from '../base-viewer';
import { RosMarker } from './ros-marker';
import { Robot } from '../../../robots/shared/robot.model';

/**
 * パスマーカーです。
 */
export class PathMarker extends RosMarker {
  /** ロボット */
  robot: Robot;

  /** リザルトトピック */
  resultTopic: ROSLIB.Topic | null;

  /** リザルトトピック(mbf) */
  resultTopicMbf: ROSLIB.Topic | null;

  /** パストピック */
  pathTopic: ROSLIB.Topic | null;

  /** パストピック(mbf) */
  pathTopicMbf: ROSLIB.Topic | null;

  /** パス */
  path: any;

  /** コンテナ */
  container: PIXI.Container;

  /** パスシェイプ */
  pathShape: PIXI.Graphics;

  /**
   * オブジェクトを構築する。
   *
   * @param viewer ビューワー
   * @param robot ロボット
   */
  constructor(viewer: BaseViewer, robot: Robot) {
    super(viewer);
    this.robot = robot;

    this.container = new PIXI.Container();
    this.pathShape = new PIXI.Graphics();
    this.container.addChild(this.pathShape);

    this.rosWorldScale.addChild(this.container);

    this.redraw();
  }

  /**
   * パスをクリアする。
   */
  clearPath(): void {
    this.setPath(null);
  }

  /**
   * パスをセットする。
   *
   * @param path パス
   */
  setPath(path: any): void {
    this.path = path;
    this.redraw();
  }

  /**
   * リドローする。
   */
  redraw(): void {
    const strokeSize = 0.4;
    const strokeColor = parseInt(this.robot.color.substring(1, 7), 16);
    const alpha = parseInt(this.robot.color.substring(7, 9), 16) / 255.0;

    this.pathShape.clear();

    if (this.path !== null && typeof this.path !== 'undefined') {
      const g = this.pathShape;
      g.lineStyle(strokeSize, strokeColor, alpha);
      for (let i = 0; i < this.path.poses.length; ++i) {
        const rosPoint = new PIXI.Point(
          this.path.poses[i].pose.position.x,
          this.path.poses[i].pose.position.y
        );
        if (i === 0) {
          g.moveTo(rosPoint.x, rosPoint.y);
        } else {
          g.lineTo(rosPoint.x, rosPoint.y);
          g.moveTo(rosPoint.x, rosPoint.y);
        }
      }
    }
  }

  /**
   * トピックをサブスクライブする。
   */
  subscribe(): void {
    const that = this;

    if (this.resultTopic == null) {
      this.resultTopic = this.viewer.getComponent().getRosService().getTopic(this.robot, {
        name: this.robot.namespace + '/move_base/result',
        messageType: 'move_base_msgs/MoveBaseActionResult'
      });
      if (this.resultTopic != null) {
        this.resultTopic.subscribe(() => {
          that.hide();
        });
      }
    }
    if (this.resultTopicMbf == null) {
      this.resultTopicMbf = this.viewer.getComponent().getRosService().getTopic(this.robot, {
        name: this.robot.namespace + '/move_base_flex/exe_path/result',
        messageType: 'mbf_msgs/ExePathActionResult'
      });
      if (this.resultTopicMbf != null) {
        this.resultTopicMbf.subscribe(() => {
          that.hide();
        });
      }
    }

    if (this.pathTopic == null) {
      this.pathTopic = this.viewer.getComponent().getRosService().getTopic(this.robot, {
        name: this.robot.namespace + '/move_base/NavfnROS/plan',
        messageType: 'nav_msgs/Path'
      });
      if (this.pathTopic != null) {
        this.pathTopic.subscribe(path => {
          that.setPath(path);
          that.show();
        });
      }
    }
    if (this.pathTopicMbf == null) {
      this.pathTopicMbf = this.viewer.getComponent().getRosService().getTopic(this.robot, {
        name: this.robot.namespace + '/move_base_flex/get_path/result',
        messageType: 'mbf_msgs/GetPathActionResult'
      });
      if (this.pathTopicMbf != null) {
        this.pathTopicMbf.subscribe((getPathActionResult: any) => {
          that.setPath(getPathActionResult.result.path);
          that.show();
        });
      }
    }
  }

  /**
   * トピックをアンサブスクライブする。
   */
  unsubscribe(): void {
    if (this.resultTopic != null) {
      this.resultTopic.unsubscribe();
      this.resultTopic = null;
    }
    if (this.resultTopicMbf != null) {
      this.resultTopicMbf.unsubscribe();
      this.resultTopicMbf = null;
    }

    if (this.pathTopic != null) {
      this.pathTopic.unsubscribe();
      this.pathTopic = null;
    }
    if (this.pathTopicMbf != null) {
      this.pathTopicMbf.unsubscribe();
      this.pathTopicMbf = null;
    }

    this.clearPath();
  }

  /**
   * 非表示にする。
   *
   * 次回表示のために非表示時にクリアする。
   */
  hide(): void {
    super.hide();
    this.clearPath();
  }
}

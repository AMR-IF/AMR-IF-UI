/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import * as ROSLIB from 'roslib';
import { Injectable } from '@angular/core';
import { Ros } from './ros';
import { Subject } from 'rxjs';
import { Robot } from '../../robots/shared/robot.model';
import { RobotUtil } from '../../robots/shared/robot-util';
import { ConnectionState } from './connection-state.enum';
import { SettingService } from '../../settings/shared/setting.service';
import { ReconfigureServiceRequest } from './messages/reconfigure-service-request.model';
import { ReconfigureServiceResponse } from './messages/reconfigure-service-response.model';
import { RoboCmd } from './messages/robo-cmd.model';
import { RoboCmdList } from './messages/robo-cmd-list.model';

/**
 * Rosサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class RosService {
  /** コネクションとRosオブジェクトのマップ */
  data: Map<string, Ros> = new Map<string, Ros>();

  /** サブジェクト */
  dataSubject: Subject<Map<string, Ros>> = new Subject();

  /**
   * オブジェクトを構築する。
   *
   * @param settingService セッティングサービス
   */
  constructor(
    public settingService: SettingService
  ) {}

  /**
   * Rosオブジェクトを取得する。
   *
   * @param robot ロボット
   */
  getRosFromConnection(robot: Robot): Ros {
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        return ros;
      }
    }
    const newRos = new Ros(url);
    this.data.set(url, newRos);
    this.dataSubject.next(this.data);
    return newRos;
  }

  /**
   * コネクトする。
   *
   * 同じ接続先の場合は再利用する。
   *
   * @param robot ロボット
   */
  connect(robot: Robot): void {
    const ros = this.getRosFromConnection(robot);
    if (ros != null) {
      if (!ros.isConnected()) {
        ros.connect();
      }
    }
  }

  /**
   * ディスコネクトする。
   *
   * @param robot ロボット
   */
  disconnect(robot: Robot): void {
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        ros.disconnect();
      }
    }
  }

  /**
   * コネクションが接続しているかどうかを返す。
   *
   * @param robot ロボット
   * @return コネクションが接続しているかどうか
   */
  isConnected(robot: Robot): boolean {
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        return ros.isConnected();
      }
    }
    return false;
  }

  /**
   * コネクションのステートを取得する。
   *
   * @param robot ロボット
   */
  getState(robot: Robot): ConnectionState {
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        return ros.getState();
      }
    }
    return ConnectionState.Disconnected;
  }

  /**
   * 自動的に接続する。
   *
   * @param robot ロボット
   */
  connectAutomatically(robot: Robot): void {
    const ros = this.getRosFromConnection(robot);
    if (ros != null) {
      if (!ros.isConnected()) {
        this.connect(robot);
      }
    }
  }

  /**
   * Rosを取得する。
   *
   * @param robot ロボット
   * @return Rosオブジェクト
   */
  getRos(robot: Robot): Ros {
    this.connectAutomatically(robot);
    return this.getRosFromConnection(robot);
  }

  /**
   * Rosを取得する。
   *
   * @param robot ロボット
   * @return Rosオブジェクト
   */
  getRosByRobot(robot: Robot): Ros {
    return this.getRos(robot);
  }

  /**
   * RoboCmdをパブリッシュする。
   *
   * @param reqTopicName リクエストトピックネーム
   * @param roboCmd コマンド
   * @param robot ロボット
   */
  publishRoboCmdAsync(
    reqTopicName: string,
    roboCmd: RoboCmd,
    robot: Robot
  ): void {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        if (ros.isConnected()) {
          ros.publishRoboCmdAsync(robot.namespace, reqTopicName, roboCmd);
        }
      }
    }
  }

  /**
   * RoboCmdListをパブリッシュする。
   *
   * @param reqTopicName リクエストトピックネーム
   * @param roboCmdList コマンドリスト
   * @param robot ロボット
   */
  publishRoboCmdListAsync(
    reqTopicName: string,
    roboCmdList: RoboCmdList,
    robot: Robot
  ): void {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        if (ros.isConnected()) {
          ros.publishRoboCmdListAsync(robot.namespace, reqTopicName, roboCmdList);
        }
      }
    }
  }

  /**
   * Reconfigureサービスをコールする。
   *
   * @param robot ロボット
   * @param name ネーム
   * @param request リクエスト
   * @return プロミス
   */
  reconfigure(
    robot: Robot,
    name: string,
    request: ReconfigureServiceRequest
  ): Promise<ReconfigureServiceResponse> {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        if (ros.isConnected()) {
          return ros.reconfigure(name, request);
        }
      }
    }
    return new Promise(reject => {
      reject();
    });
  }

  /**
   * トピックを取得する。
   *
   * @param robot ロボット
   * @param options オプション
   * @return トピック
   */
  getTopic(robot: Robot, options: any): ROSLIB.Topic | null {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        return ros.getTopic(options);
      }
    }
    return null;
  }

  /**
   * 全てのトピックを取得する。
   *
   * @param robot ロボット
   * @param callback コールバック
   * @param failedCallback フェイルドコールバック
   */
  getTopics(robot: Robot, callback: any, failedCallback: any): void {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        ros.getTopics(callback, failedCallback);
      }
    }
  }

  /**
   * パラメータを取得する。
   *
   * @param robot ロボット
   * @param options オプション
   * @return パラメーター
   */
  getParam(robot: Robot, options: any): ROSLIB.Param | null {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        return ros.getParam(options);
      }
    }
    return null;
  }

  /**
   * 全てのパラメータを取得する。
   *
   * @param robot ロボット
   * @param callback コールバック
   * @param failedCallback フェイルドコールバック
   */
  getParams(robot: Robot, callback: any, failedCallback: any): void {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        ros.getParams(callback, failedCallback);
      }
    }
  }

  /**
   * 全てのノードを取得する。
   *
   * @param robot ロボット
   * @param callback コールバック
   * @param failedCallback フェイルドコールバック
   */
  getNodes(robot: Robot, callback: any, failedCallback: any): void {
    this.connectAutomatically(robot);
    const url = RobotUtil.getURL(robot);
    if (this.data.has(url)) {
      const ros = this.data.get(url);
      if (ros != null) {
        ros.getNodes(callback, failedCallback);
      }
    }
  }
}

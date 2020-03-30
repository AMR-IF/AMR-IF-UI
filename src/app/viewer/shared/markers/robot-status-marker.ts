/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Observable } from 'rxjs';
import { BaseViewer } from '../base-viewer';
import { BaseMarker } from './base-marker';
import { Robot } from '../../../robots/shared/robot.model';
import { TopicSubscriber } from '../../../shared/ros/topic-subscriber';
import { RoboCmd } from '../../../shared/ros/messages/robo-cmd.model';
import { RoboCmdList } from '../../../shared/ros/messages/robo-cmd-list.model';
import { RoboRes } from '../../../shared/ros/messages/robo-res.model';
import { RoboResList } from '../../../shared/ros/messages/robo-res-list.model';
import { environment } from 'src/environments/environment';
import { Protocol } from '../protocol/protocol.model';
import { ProtocolManager } from '../protocol/protocol-manager';

/**
 * ロボットステータスマーカーです。
 */
export class RobotStatusMarker extends BaseMarker {

  /** ロボット */
  robot: Robot;

  /** ロボレスポンスリストトピック */
  roboResListTopic: ROSLIB.Topic;

  /** プロトコルマネージャーアレイ */
  protocolManagers: ProtocolManager<any, any>[] = [];

  /** トピックサブスクライバーアレイ */
  topicSubscribers: TopicSubscriber[] = [];

  /**
   * オブジェクトを構築する。
   *
   * @param viewer ビューワー
   * @param robot ロボット
   */
  constructor(viewer: BaseViewer, robot: Robot) {
    super(viewer);
    this.robot = robot;
    const that = this;
    const config = environment.config;
    config.protocols.forEach((element: Protocol) => {
      let protocolManager;
      if (
        element.request.messageType === 'trr_msgs/RoboCmdList' &&
        element.response.messageType === 'trr_msgs/RoboResList'
      ) {
        protocolManager = new ProtocolManager<RoboCmdList, RoboResList>(that, element);
      } else if (
        element.request.messageType === 'trr_msgs/RoboCmd' &&
        element.response.messageType === 'trr_msgs/RoboRes'
      ) {
        protocolManager = new ProtocolManager<RoboCmd, RoboRes>(that, element);
      }
      if (protocolManager) {
        that.protocolManagers.push(protocolManager);
        that.topicSubscribers.push(protocolManager);
      }
    });
  }

  /**
   * トピックをサブスクライブする。
   */
  subscribe(): void {
    this.topicSubscribers.forEach(element => element.subscribe());
  }

  /**
   * トピックをアンサブスクライブする。
   */
  unsubscribe(): void {
    this.topicSubscribers.forEach(element => element.unsubscribe());
  }

  /**
   * レスポンストピックネームからプロトコルマネージャをゲットする。
   *
   * @param resTopicName レスポンストピックネーム
   */
  getProtocolManagerByResTopicName(
    resTopicName: string
  ): ProtocolManager<any, any> | undefined {
    return this.protocolManagers.find(
      element => element.protocol.response.topic === resTopicName
    );
  }

  /**
   * レスポンスを削除する。
   *
   * @param resTopicName レスポンストピックネーム
   * @param id アイディー
   */
  removeResponse(resTopicName: string, id: string) {
    const protocolManager = this.getProtocolManagerByResTopicName(resTopicName);
    if (protocolManager !== undefined) {
      protocolManager.removeResponse(id);
    }
  }

  /**
   * レスポンスオブザーバブルを取得する。
   *
   * @param resTopicName レスポンストピックネーム
   * @return レスポンスオブザーバブル
   */
  getRoboResObservable(resTopicName: string): Observable<RoboRes[]> | null {
    const protocolManager = this.getProtocolManagerByResTopicName(resTopicName);
    if (protocolManager !== undefined) {
      return protocolManager.getResponseObservable();
    } else {
      return null;
    }
  }

  /**
   * レスポンスリストオブザーバブルを取得する。
   *
   * @param resTopicName レスポンスリストトピックネーム
   * @return レスポンスリストオブザーバブル
   */
  getRoboResListObservable(resTopicName: string): Observable<RoboResList[]> | null {
    const protocolManager = this.getProtocolManagerByResTopicName(resTopicName);
    if (protocolManager !== undefined) {
      return protocolManager.getResponseObservable();
    } else {
      return null;
    }
  }

  /**
   *  ロボットを取得する。
   *
   * @return ロボット
   */
  getRobot(): Robot {
    return this.robot;
  }

  /**
   * トピックを取得する。
   *
   * @param options オプション
   * @return トピック
   */
  getTopic(options: any): ROSLIB.Topic | null {
    return this.viewer.getComponent().getRosService().getTopic(this.robot, options);
  }
}

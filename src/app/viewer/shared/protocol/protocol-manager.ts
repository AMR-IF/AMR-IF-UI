/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Subject, Observable } from 'rxjs';
import { Protocol } from './protocol.model';
import { ProtocolAgent } from './protocol-agent';
import { RoboCmd } from '../../../shared/ros/messages/robo-cmd.model';
import { RoboRes } from '../../../shared/ros/messages/robo-res.model';
import { RoboResList } from '../../../shared/ros/messages/robo-res-list.model';
import { RoboCmdList } from '../../../shared/ros/messages/robo-cmd-list.model';

/**
 * プロトコルマネージャです。
 */
export class ProtocolManager<
  C extends RoboCmd | RoboCmdList,
  R extends RoboRes | RoboResList
> {
  /** プロトコルエージェント */
  protocolAgent: ProtocolAgent;

  /** プロトコル */
  protocol: Protocol;

  /** リクエストトピック */
  requestTopic: ROSLIB.Topic | null;

  /** リクエストアレイ */
  request: C[] = [];

  /** リクエストサブジェクト */
  requestSubject: Subject<C[]> = new Subject();

  /** リクエストオブザーバブル */
  requestObservable: Observable<C[]> = this.requestSubject.asObservable();

  /** レスポンストピック */
  responseTopic: ROSLIB.Topic | null;

  /** レスポンスアレイ */
  response: R[] = [];

  /** レスポンスサブジェクト */
  responseSubject: Subject<R[]> = new Subject();

  /** レスポンスオブザーバブル */
  responseObservable: Observable<R[]> = this.responseSubject.asObservable();

  /**
   * オブジェクトを構築する。
   *
   * @param protocolAgent プロトコルエージェント
   * @param protocol プロトコル
   */
  constructor(protocolAgent: ProtocolAgent, protocol: Protocol) {
    this.protocolAgent = protocolAgent;
    this.protocol = protocol;
  }

  /**
   * リクエストメッセージをプッシュする。
   *
   * @param message メッセージ
   */
  pushRequestMessage(message: C): void {
    this.request.push(message);
    this.requestSubject.next(this.request);
  }

  /**
   * レスポンスメッセージをプッシュする。
   *
   * @param message メッセージ
   */
  pushResponseMessage(message: R): void {
    this.response.push(message);
    this.responseSubject.next(this.response);
  }

  /**
   * レスポンスを削除する。
   *
   * @param id アイディー
   */
  removeResponse(id: string) {
    this.response = this.response.filter(element => element.id !== id);
  }

  /**
   * レスポンスオブザーバブルを取得する。
   *
   * @return レスポンスオブザーバブル
   */
  getResponseObservable(): Observable<R[]> {
    return this.responseObservable;
  }

  /**
   * トピックをサブスクライブする。
   */
  subscribe(): void {
    const that = this;

    // request
    if (this.requestTopic == null) {
      if (this.protocol.request) {
        if (this.protocol.request.topic !== '') {
          const requestTopicName = this.protocol.request.topic;
          const requestTopicMessageType = this.protocol.request.messageType;
          this.requestTopic = this.protocolAgent.getTopic({
            name: this.protocolAgent.getRobot().namespace + '/' + requestTopicName,
            messageType: requestTopicMessageType
          });
          if (this.requestTopic != null) {
            this.requestTopic.advertise();
            this.requestTopic.subscribe((message: C) => {
              that.pushRequestMessage(message);
            });
          }
        }
      }
    }

    // response
    if (this.responseTopic == null) {
      if (this.protocol.response) {
        if (this.protocol.response.topic !== '') {
          const responseTopicName = this.protocol.response.topic;
          const responseTopicMessageType = this.protocol.response.messageType;
          this.responseTopic = this.protocolAgent.getTopic({
            name: this.protocolAgent.getRobot().namespace + '/' + responseTopicName,
            messageType: responseTopicMessageType
          });
          if (this.responseTopic != null) {
            this.responseTopic.advertise();
            this.responseTopic.subscribe((message: R) => {
              that.pushResponseMessage(message);
            });
          }
        }
      }
    }
  }

  /**
   * トピックをアンサブスクライブする。
   */
  unsubscribe(): void {
    if (this.requestTopic != null) {
      this.requestTopic.unadvertise();
      this.requestTopic.unsubscribe();
      this.requestTopic = null;
    }
    if (this.responseTopic != null) {
      this.responseTopic.unadvertise();
      this.responseTopic.unsubscribe();
      this.responseTopic = null;
    }
  }
}

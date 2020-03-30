/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import * as ROSLIB from 'roslib';
import { Observable, Subject, Subscription } from 'rxjs';
import { ConnectionState } from './connection-state.enum';
import { ReconfigureServiceResponse } from './messages/reconfigure-service-response.model';
import { ReconfigureServiceRequest } from './messages/reconfigure-service-request.model';
import { RoboCmd } from './messages/robo-cmd.model';
import { RoboCmdList } from './messages/robo-cmd-list.model';

/**
 * Rosオブジェクトです。
 */
export class Ros {
  /** ユーアールエル */
  url: string;

  /** Rosオブジェクト */
  ros: ROSLIB.Ros;

  /** ステート */
  state: ConnectionState;

  /** ステートサブジェクト */
  stateSubject: Subject<ConnectionState> = new Subject();

  /** オブザーバブルステート */
  observableState: Observable<
    ConnectionState
  > = this.stateSubject.asObservable();

  /** ウェイティングリトライプロミス */
  waitingRetryPromise: Promise<string>;

  /** ウェイティングリトライサブスクリプション */
  waitingRetrySubscription: Subscription | null;

  /**
   * オブジェクトを構築する。
   *
   * @param url ユーアールエル
   */
  constructor(url: string) {
    this.url = url;
    this.state = ConnectionState.Disconnected;
    this.ros = new ROSLIB.Ros({});

    // define callback once
    const that = this;
    this.ros.on('connection', () => {
      that.changeState(ConnectionState.Connected);
    });

    this.ros.on('error', () => {
      // auto retry
      that.retry();
    });

    this.ros.on('close', () => {
      if (that.state === ConnectionState.Disconnecting) {
        that.changeState(ConnectionState.Disconnected);
        // do not retry
      } else {
        that.changeState(ConnectionState.Disconnected);
        // auto retry
        that.retry();
      }
    });
  }

  /**
   * 接続する。
   *
   * ステートが変化したら知らせる。
   */
  connect(): void {
    if (this.state === ConnectionState.Disconnected) {
      this.connecting();
    }
  }

  /**
   * リトライする。
   */
  retry(): void {
    if (this.state === ConnectionState.Disconnected) {
      this.changeState(ConnectionState.Retrying);
      const intervalMsec = 30 * 1000; // 30sec

      // Promise Cancellation
      // Use Rx Subscriptions
      this.waitingRetrySubscription = new Subscription();
      this.waitingRetryPromise = new Promise<string>(resolve => {
        const timeoutId = setTimeout(() => {
          if (this.waitingRetrySubscription != null) {
            this.waitingRetrySubscription.unsubscribe();
            this.waitingRetrySubscription = null;
          }
          resolve('Waiting successfully');
        }, intervalMsec);
        // add tearDown logic to the subscription
        if (this.waitingRetrySubscription != null) {
          this.waitingRetrySubscription.add(() => {
            clearTimeout(timeoutId);
          });
        }
      });
      this.waitingRetryPromise.then(() => {
        // wait successfully
        this.connecting();
      });
    }
  }

  /**
   * 接続し始める。
   */
  connecting(): void {
    this.changeState(ConnectionState.Connecting);
    this.ros.connect(this.url);
  }

  /**
   * ディスコネクトする。
   */
  disconnect(): void {
    if (this.state !== ConnectionState.Disconnected) {
      if (this.state === ConnectionState.Retrying) {
        this.cancel();
      } else {
        this.changeState(ConnectionState.Disconnecting);
        this.ros.close();
      }
    }
  }

  /**
   * キャンセルする。
   */
  cancel(): void {
    if (this.waitingRetrySubscription) {
      this.waitingRetrySubscription.unsubscribe();
      this.waitingRetrySubscription = null;
      this.changeState(ConnectionState.Disconnected);
    }
  }

  /**
   * ステートを変更する。
   *
   * @param state ステート
   */
  private changeState(state: ConnectionState): void {
    this.state = state;
    this.stateSubject.next(this.state);
  }

  /**
   * オブザーバブルなステートを取得する。
   *
   * @return オブザーバブルなステート
   */
  getStateObservable(): Observable<ConnectionState> {
    return this.observableState;
  }

  /**
   * 接続されているかどうかを返す。
   *
   * @return 接続されているかどうか
   */
  isConnected(): boolean {
    return this.state === ConnectionState.Connected;
  }

  /**
   * ステートを取得する。
   *
   * @return ステート
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * トピックを取得する。
   *
   * @param options オプション
   * @return トピック
   */
  getTopic(options: any): ROSLIB.Topic {
    options = options || {};
    options.ros = this.ros;
    return new ROSLIB.Topic(options);
  }

  /**
   * 全てのトピックを取得する。
   *
   * @param callback コールバック
   * @param failedCallback フェイルドコールバック
   */
  getTopics(callback: any, failedCallback?: any) {
    this.ros.getTopics(callback, failedCallback);
  }

  /**
   * パラメータを取得する。
   *
   * @param options オプション
   * @return パラメータ
   */
  getParam(options: any): ROSLIB.Param {
    options = options || {};
    options.ros = this.ros;
    return new ROSLIB.Param(options);
  }

  /**
   * 全てのパラメータを取得する。
   *
   * @param callback コールバック
   * @param failedCallback フェイルドコールバック
   */
  getParams(callback: any, failedCallback?: any) {
    this.ros.getParams(callback, failedCallback);
  }

  /**
   * 全てのノードを取得する。
   *
   * @param callback コールバック
   * @param failedCallback フェイルドコールバック
   */
  getNodes(callback: any, failedCallback?: any) {
    this.ros.getNodes(callback, failedCallback);
  }

  /**
   * Reconfigureサービスをコールする。
   *
   * @param name ネーム
   * @param request リクエスト
   * @return プロミス
   */
  reconfigure(
    name: string,
    request: ReconfigureServiceRequest
  ): Promise<ReconfigureServiceResponse> {
    const service = new ROSLIB.Service({
      ros: this.ros,
      name,
      serviceType: 'dynamic_reconfigure/Reconfigure'
    });
    const serviceRequest = new ROSLIB.ServiceRequest(request);

    return new Promise(resolve => {
      service.callService(serviceRequest, (res: ReconfigureServiceResponse) => {
        resolve(res);
      });
    });
  }

  /**
   * RoboCmdをパブリッシュする。
   *
   * @param reqTopicName リクエストトピックネーム
   * @param roboCmd コマンド
   */
  publishRoboCmdAsync(
    namespace: string,
    reqTopicName: string,
    roboCmd: RoboCmd
  ): void {
    const name = namespace + '/' + reqTopicName;

    const topic = new ROSLIB.Topic({
      ros: this.ros,
      name,
      messageType: 'trr_msgs/RoboCmd'
    });
    const message = new ROSLIB.Message(roboCmd);
    topic.publish(message);
  }

  /**
   * RoboCmdListをパブリッシュする。
   *
   * @param namespace ネームスペース
   * @param reqTopicName リクエストトピックネーム
   * @param roboCmdList コマンドリスト
   */
  publishRoboCmdListAsync(
    namespace: string,
    reqTopicName: string,
    roboCmdList: RoboCmdList
  ): void {
    const name = namespace + '/' + reqTopicName;

    const topic = new ROSLIB.Topic({
      ros: this.ros,
      name,
      messageType: 'trr_msgs/RoboCmdList'
    });
    const message = new ROSLIB.Message(roboCmdList);
    topic.publish(message);
  }
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { Subscription, Subject, Observable } from 'rxjs';
import { BaseViewer } from '../base-viewer';
import { PathMarker } from './path-marker';
import { OrientationMarker } from './orientation-marker';
import { MapMarker } from './map-marker';
import { PoseMarker } from './pose-marker';
import { Robot } from '../../../robots/shared/robot.model';
import { RobotStatusMarker } from './robot-status-marker';
import { ConnectionState } from '../../../shared/ros/connection-state.enum';
import { Ros } from '../../../shared/ros/ros';
import { CommandInfo } from '../../../commands/shared/command-info.model';
import { RoboCmd } from '../../../shared/ros/messages/robo-cmd.model';
import { RoboRes } from '../../../shared/ros/messages/robo-res.model';
import { CmdList } from '../../../cmd-lists/shared/cmd-list.model';
import { RoboCmdList } from '../../../shared/ros/messages/robo-cmd-list.model';
import { RoboResList } from '../../../shared/ros/messages/robo-res-list.model';
import { InputDialogComponent } from '../../input-dialog/input-dialog.component';
import { SelectDialogComponent } from '../../select-dialog/select-dialog.component';

/**
 * ロボットマーカーです。
 */
export class RobotMarker extends OrientationMarker {
  /** ロボット */
  robot: Robot;

  /** Ros */
  ros: Ros;

  /** ポーズマーカー */
  poseMarker: PoseMarker;

  /** パスマーカー */
  pathMarker: PathMarker;

  /** ロボットステータスマーカー */
  robotStatusMarker: RobotStatusMarker;

  /** マップマーカー */
  mapMarker: MapMarker;

  /** コンテナ */
  container: PIXI.Container;

  /** ステートサブスクリプション */
  stateSubscription: Subscription;

  /** コネクション */
  connection = false;

  /** コネクションサブジェクト */
  connectionSubject: Subject<boolean> = new Subject();

  /** コネクションオブザーバブル */
  connectionObservable: Observable<
    boolean
  > = this.connectionSubject.asObservable();

  /** タイムアウトアイディーアレイ */
  timeoutIds: any[] = [];

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
    const ros = this.viewer.getComponent().getRosService().getRosByRobot(this.robot);
    if (ros !== undefined) {
      this.ros = ros;
      let lastState = this.ros.getState();
      if (lastState === ConnectionState.Connected) {
        this.connection = true;
      } else {
        this.connection = false;
      }
      this.connectionSubject.next(this.connection);

      this.stateSubscription = this.ros.getStateObservable().subscribe(state => {
        if (lastState === ConnectionState.Connected) {
          if (state !== ConnectionState.Connected) {
            that.connection = false;
            that.connectionSubject.next(that.connection);
            that.onDisconnected();
          }
        }

        if (
          lastState !== ConnectionState.Connected &&
          state === ConnectionState.Connected
        ) {
          that.connection = true;
          that.connectionSubject.next(that.connection);
          that.onConnected();
        }

        lastState = state;
      });
    }

    this.container = new PIXI.Container();
    this.container.parentGroup = this.viewer.robotsGroup;

    this.robotWorldScale.addChild(this.container);

    // markers
    this.pathMarker = new PathMarker(this.viewer, this.getRobot());
    this.robotStatusMarker = new RobotStatusMarker(this.viewer, this.getRobot());
    this.pathMarker.hide();

    this.poseMarker = new PoseMarker(this.viewer);
    this.poseMarker.setRobot(this.robot);
    this.poseMarker.setColor(this.robot.color);
    this.poseMarker.setText(this.robot.name);
    this.poseMarker.setPulse(true);
    this.poseMarker.setStroke(true);
    const rospose = {
      position: { x: 0, y: 0, z: 0 },
      orientation: { x: 0, y: 0, z: 0, w: 1 }
    } as ROSLIB.Pose;
    this.poseMarker.setRosPose(rospose);

    this.mapMarker = new MapMarker(this.viewer, this.getRobot(), 'floormap');
  }

  /**
   * ロボットをゲットする。
   *
   * @return ロボット
   */
  getRobot(): Robot {
    return this.robot;
  }

  /**
   * コネクションのオブザーバブルを取得する。
   *
   * @return オブザーバブル
   */
  getConnectionObservable(): Observable<boolean> {
    return this.connectionObservable;
  }

  /**
   * コネクトされたときにコールバックする。
   */
  onConnected(): void {
    this.subscribe();
  }

  /**
   * ディスコネクトされたときにコールバックする。
   */
  onDisconnected(): void {
    this.unsubscribe();
  }

  /**
   * ポーズをセットする。
   *
   * @param rospose ポーズ
   */
  setRosPose(rospose: ROSLIB.Pose): void {
    super.setRosPose(rospose);
    if (rospose != null) {
      this.poseMarker.setRosPose(rospose);
    }
  }

  /**
   * コネクトされているかを取得する。
   *
   * @return コネクトされているか
   */
  isConnected(): boolean {
    return this.connection;
  }

  /**
   * コネクトする。
   */
  connect(): void {
    if (this.ros.getState() === ConnectionState.Retrying) {
      this.ros.cancel();
    } else {
      this.ros.connect();
    }
  }

  /**
   * ディスコネクトする。
   */
  disconnect(): void {
    this.ros.disconnect();
  }

  /**
   * トピックをサブスクライブする。
   */
  subscribe(): void {
    this.poseMarker.subscribe();
    this.pathMarker.subscribe();
    this.robotStatusMarker.subscribe();
    this.mapMarker.subscribe();
  }

  /**
   * トピックをアンサブスクライブする。
   */
  unsubscribe(): void {
    this.poseMarker.unsubscribe();
    this.pathMarker.unsubscribe();
    this.robotStatusMarker.unsubscribe();
    this.mapMarker.unsubscribe();
  }

  /**
   * 削除する。
   */
  remove(): void {
    super.remove();
    this.viewer.getComponent().getRobotService().remove(this.robot);
    this.poseMarker.remove();
    this.pathMarker.remove();
    this.robotStatusMarker.remove();
    this.mapMarker.remove();
  }

  /**
   * 破棄する。
   *
   * サブスクリプションをアンサブスクライブする。
   */
  dispose(): void {
    super.dispose();
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
    this.timeoutIds.forEach(element => clearTimeout(element));
    this.disconnect();
  }

  /**
   * RoboCmdのidをissueする。
   *
   * @param Date 日時
   * @return アイディー
   */
  issueRoboCmdId(date: Date): string {
    const now = '' +
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      '_' +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2) +
      '_' +
      ('00' + date.getMilliseconds()).slice(-3);
    return now;
  }

  /**
   * レスポンスを削除する。
   *
   * @param resTopicName レスポンストピックネーム
   * @param id アイディー
   */
  removeResponse(resTopicName: string, id: string) {
    this.robotStatusMarker.removeResponse(resTopicName, id);
  }

  /**
   * レスポンスオブザーバブルを取得する。
   *
   * @param resTopicName レスポンストピックネーム
   * @return レスポンスオブザーバブル
   */
  getRoboResObservable(resTopicName: string): Observable<RoboRes[]> | null {
    return this.robotStatusMarker.getRoboResObservable(resTopicName);
  }

  /**
   * レスポンスオブザーバブルを取得する。
   *
   * @param resTopicName レスポンストピックネーム
   * @return レスポンスオブザーバブル
   */
  getRoboResListObservable(resTopicName: string): Observable<RoboResList[]> | null {
    return this.robotStatusMarker.getRoboResListObservable(resTopicName);
  }

  /**
   * ロボコマンドを実行する。
   *
   * @param roboCmd ロボコマンド
   * @return オブザーバブル
   */
  executeRoboCmd(
    roboCmd: RoboCmd
  ): Observable<RoboRes> | null {
    const that = this;
    const timeoutMSec = 60 * 1000; // 1 min
    const roboResSubject: Subject<RoboRes> = new Subject();
    const infos = this.viewer.getComponent().getCommandService().commandsInfo.filter(
      element => element.cmd === roboCmd.cmd
    );
    if (!infos) {
      // missing unknown command
      return null;
    }

    const reqTopicName = infos[0].request;
    const resTopicName = infos[0].response;
    const observable = that.getRoboResObservable(resTopicName);
    if (observable != null) {
      let subscription: Subscription;
      const now = new Date();
      const id = that.issueRoboCmdId(now);
      roboCmd.id = id;

      let timeoutId: any;
      let hasResponse = false;
      const timeout = new Promise<RoboRes>(reject => {
        timeoutId = that.setCmdTimeout(() => {
          reject({
            id: roboCmd.id,
            cmd: roboCmd.cmd,
            status: 'Timed out in ' + timeoutMSec + ' ms.'
          } as RoboRes);
        }, timeoutMSec);
      });
      const promise = new Promise<RoboRes>(resolve => {
        subscription = observable.subscribe(roboRes => {
          const filtered = roboRes.filter(element => element.id === id);
          if (0 < filtered.length) {
            if (!hasResponse) {
              that.clearCmdTimeout(timeoutId);
              hasResponse = true;
            }
            for (const filter of filtered) {
              const status = filter.status;
              if (
                status.startsWith('succeeded') ||
                status.startsWith('rejected') ||
                status.startsWith('aborted') ||
                status.startsWith('preempted')
              ) {
                resolve(filter);
              } else if (status.startsWith('processing')) {
                // reset timeout countdown
                that.removeResponse(resTopicName, id);
              } else {
                // do nothing
              }
            }
          }
        });
      });
      Promise.race([promise, timeout])
        .then(roboRes => {
          that.clearCmdTimeout(timeoutId);

          if (!roboRes.status.startsWith('Timed')) {
            that.removeResponse(resTopicName, id);
          }
          subscription.unsubscribe();
          roboResSubject.next(roboRes);
        })
        .catch(() => {});

      that.viewer.getComponent().getRosService().publishRoboCmdAsync(
        reqTopicName,
        roboCmd,
        that.robot
      );

      return roboResSubject.asObservable();
    } else {
      return null;
    }
  }

  /**
   * RoboCmdをダイアログでパラメータを入力してから実行する。
   *
   * @param cmd コマンド
   */
  executeRoboCmdWithInuptParam(cmd: string): void {
    const commandsInfo = this.viewer.getComponent().getCommandService()
      .getCommandsInfo()
      .filter(element => element.cmd === cmd);
    const infos = commandsInfo.filter(element => element.cmd === cmd);
    const reqTopicName = infos[0].request;
    const resTopicName = infos[0].response;
    const params: string[] = [];
    this.inputParam(reqTopicName, resTopicName, cmd, commandsInfo, params);
  }

  /**
   * Roboコマンドのパラメータをダイアログで入力する。
   *
   * @param reqTopicName リクエストトピックネーム
   * @param resTopicName レスポンストピックネーム
   * @param cmd コマンド
   * @param commandsInfo コマンドインフォアレイ
   * @param params パラメータ
   */
  inputParam(
    reqTopicName: string,
    resTopicName: string,
    cmd: string,
    commandsInfo: CommandInfo[],
    params: string[]
  ): void {
    const that = this;
    const count = commandsInfo[0].paramCount;
    if (count === params.length) {
      const roboCmd = {
        cmd,
        params
      } as RoboCmd;
      this.executeRoboCmd(roboCmd);
    } else {
      this.viewer.getComponent().getNgZone().run(() => {
        const commandService = that.viewer.getComponent().getCommandService();
        const hint = commandService.getHint(cmd, params.length);
        const options = commandService.getAutocomplete(cmd, params.length);
        const dialogRef = that.viewer.getComponent().getInputDialog().open(
          InputDialogComponent,
          {
            width: '480px',
            data: {
              title: cmd + ': Param' + params.length + ' : ' + hint,
              placeholder: 'Enter param',
              options
            }
          }
        );

        dialogRef.afterClosed().subscribe(result => {
          const isCanceled = typeof result === 'undefined';
          if (!isCanceled) {
            params.push(result);
            that.inputParam(
              reqTopicName,
              resTopicName,
              cmd,
              commandsInfo,
              params
            );
          }
        });
      });
    }
  }

  /**
   * ダイアログからRoboCmdを実行する。
   */
  executeRoboCmdFromDialog(): void {
    const that = this;
    this.viewer.getComponent().getNgZone().run(() => {
      const options = that.viewer.getComponent().getCommandService().getCmds();
      const dialogRef = that.viewer.getComponent().getInputDialog().open(
        SelectDialogComponent,
        {
          width: '480px',
          data: {
            title: 'Execute a roboCmd',
            placeholder: 'Select a roboCmd',
            options,
            selected: options[0]
          }
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        const isCanceled = typeof result === 'undefined';
        if (!isCanceled) {
          that.executeRoboCmdWithInuptParam(result);
        }
      });
    });
  }

  /**
   * run_navのRoboCmdをパブリッシュする。
   */
  runNavRoboCmd(): void {
    this.executeRoboCmdWithInuptParam('run_nav');
  }

  /**
   * kill_navのRoboCmdをパブリッシュする。
   */
  killNavRoboCmd(): void {
    this.executeRoboCmd(
      {id: '', cmd: 'kill_nav', params: [], nextid: []} as RoboCmd
    );
  }

  /**
   * set_poseのRoboCmdをパブリッシュする。
   */
  setPoseRoboCmd(): void {
    this.executeRoboCmdWithInuptParam('set_pose');
  }

  /**
   * gotoのRoboCmdをパブリッシュする。
   */
  gotoRoboCmd(): void {
    this.executeRoboCmdWithInuptParam('goto');
  }

  /**
   * cancelのRoboCmdをパブリッシュする。
   */
  cancelRoboCmd(): void {
    this.executeRoboCmd(
      {id: '', cmd: 'cancel', params: [], nextid: []} as RoboCmd
    );
  }

  /**
   * コマンドリストアイディーをビルドする。
   *
   * @param cmdList コマンドリスト
   * @return コマンドリストアイディー
   */
  buildCmdListId(cmdList: CmdList): string {
    const now = new Date();
    const issueId = this.issueRoboCmdId(now);
    const cmdListId = cmdList.id;
    const appId = 'AMR-IF-UI';
    return issueId + '-' + cmdListId + '-' + appId;
  }

  /**
   * コマンドリストを実行する。
   *
   * @param cmdList コマンドリスト
   * @return オブザーバブル
   */
  executeCmdList(cmdList: CmdList): Observable<RoboResList> | null {
    return this.executeCmdListWithStartIndex(cmdList, 0);
  }

  /**
   * スタートインデックスを指定してコマンドリストを実行する。
   *
   * @param cmdList コマンドリスト
   * @param startIndex スタートインデックス
   * @return オブザーバブル
   */
  executeCmdListWithStartIndex(
    cmdList: CmdList,
    startIndex: number
  ): Observable<RoboResList> | null {
    const that = this;
    const timeoutMSec = 60 * 1000; // 1 min
    const roboResListSubject: Subject<RoboResList> = new Subject();

    const reqTopicName = 'robo_cmdlist';
    const resTopicName = 'robo_reslist';
    const commands: RoboCmd[] = [];
    cmdList.commands.forEach(element => commands.push(element.command));
    const mode = 'custom';
    const params: string[] = [mode, String(startIndex)];
    const observable = that.getRoboResListObservable(resTopicName);
    if (observable != null) {
      let subscription: Subscription;
      const id = that.buildCmdListId(cmdList);
      const roboCmdList = {
        cmdlist: commands,
        params
      } as RoboCmdList;
      roboCmdList.id = id;

      let timeoutId: any;
      let hasResponse = false;
      const timeout = new Promise<RoboResList>(reject => {
        timeoutId = that.setCmdTimeout(() => {
          reject({
            id: roboCmdList.id,
            reslist: [],
            status: 'Timed out in ' + timeoutMSec + ' ms.'
          } as RoboResList);
        }, timeoutMSec);
      });
      const promise = new Promise<RoboResList>(resolve => {
        subscription = observable.subscribe(roboResList => {
          const filtered = roboResList.filter(element => element.id === id);
          if (0 < filtered.length) {
            if (!hasResponse) {
              that.clearCmdTimeout(timeoutId);
              hasResponse = true;
            }
            for (const filter of filtered) {
              const status = filter.status;
              if (
                status.startsWith('succeeded') ||
                status.startsWith('rejected') ||
                status.startsWith('aborted') ||
                status.startsWith('preempted')
              ) {
                resolve(filter);
              } else if (status.startsWith('processing')) {
                that.removeResponse(resTopicName, id);
              } else {
                // do nothing
              }
            }
          }
        });
      });

      Promise.race([promise, timeout])
        .then(roboResList => {
          that.clearCmdTimeout(timeoutId);
          // delete res
          that.removeResponse(resTopicName, id);
          subscription.unsubscribe();
          roboResListSubject.next(roboResList);
        })
        .catch(() => {});

      that.viewer.getComponent().getRosService().publishRoboCmdListAsync(
        reqTopicName,
        roboCmdList,
        that.robot
      );

      return roboResListSubject.asObservable();
    } else {
      return null;
    }
  }

  /**
   * ダイアログからコマンドリストを実行する。
   */
  executeCmdListFromDialog(): void {
    const that = this;
    this.viewer.getComponent().getNgZone().run(() => {
      const cmdListService = that.viewer.getComponent().getCmdListService();
      const options = cmdListService.getCmdLists();
      const dialogRef = that.viewer.getComponent().getSelectDialog().open(
        SelectDialogComponent,
        {
          width: '480px',
          data: {
            title: 'Execute a cmdList',
            placeholder: 'Select a cmdList',
            options,
            selected: options[0]
          }
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        const isCanceled = typeof result === 'undefined';
        if (!isCanceled) {
          const cmdList = cmdListService.getByName(result);
          if (cmdList != null) {
            that.selectStartIndex(cmdList);
          }
        }
      });
    });
  }

  /**
   * スタートインデックスを指定してコマンドリストを実行する。
   *
   * @param cmdList コマンドリスト
   */
  selectStartIndex(cmdList: CmdList): void {
    const that = this;
    this.viewer.getComponent().getNgZone().run(() => {
      const options: string[] = [];
      cmdList.commands.forEach((element, index) => {
        const cmd = element.command.cmd;
        const params = element.command.params;
        options.push(index + ':' + cmd + '(' + params.join(',') + ')');
      });
      const dialogRef = that.viewer.getComponent().getSelectDialog().open(
        SelectDialogComponent,
        {
          width: '480px',
          data: {
            title: 'Set a Index',
            placeholder: 'Select a Index',
            options,
            selected: options[0]
          }
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        const isCanceled = typeof result === 'undefined';
        if (!isCanceled) {
          const id = options.indexOf(result);
          that.executeCmdListWithStartIndex(
            cmdList,
            id
          );
        }
      });
    });
  }

  /**
   * IDからコマンドリストを実行する。
   */
  executeCmdListById(id: number): void {
    const cmdListService = this.viewer.getComponent().getCmdListService();
    const cmdList = cmdListService.getById(id);
    if (cmdList != null) {
      this.executeCmdList(cmdList);
    }
  }

  /**
   * タイムアウトをセットする。
   *
   * @param handler ハンドラー
   * @param timeout タイムアウト
   */
  setCmdTimeout(handler: any, timeout: any): any {
    const timeoutId = setTimeout(handler, timeout);
    this.timeoutIds.push(timeoutId);
    return timeoutId;
  }

  /**
   * タイムアウトをクリアする。
   *
   * @param timeoutId タイムアウトアイディー
   */
  clearCmdTimeout(timeoutId: any): void {
    clearTimeout(timeoutId);
    this.timeoutIds = this.timeoutIds.filter(element => element !== timeoutId);
  }
}

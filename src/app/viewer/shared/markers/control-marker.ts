/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { Subscription } from 'rxjs';
import { BaseViewer } from '../base-viewer';
import { BaseMarker } from './base-marker';
import { RobotMarker } from './robot-marker';
import { IconMarker } from './icon-marker';
import { Icon } from './icon.model';
import { ConnectionState } from '../../../shared/ros/connection-state.enum';
import { SelectDialogComponent } from '../../select-dialog/select-dialog.component';

/**
 * コントロールマーカーです。
 */
export class ControlMarker extends BaseMarker {
  /** ロボットアイディー */
  robotId = -1;

  /** テキストマージン */
  textMargin = 8;

  /** ロボットカラー */
  robotColor = 0;

  /** ロボットアルファ */
  robotAlpha = 1.0;

  /** アクティブカラー */
  activeColor = 0x000000;

  /** インアクティブカラー */
  inactiveColor = 0xffffff;

  /** フォントサイズ */
  fontSize = 18;

  /** アイコンフォントサイズ */
  iconFontSize = 24;

  /** ターゲットロボットフォントサイズ */
  targetRobotFontSize = 28;

  /** ラインハイト */
  lineHeight = 32;

  /** ストロークシックネス */
  strokeThickness = 4;

  /** ロボットマーカー */
  robotMarker: RobotMarker;

  /** コンテナ */
  container: PIXI.Container;

  /** バックグラウンド */
  background: PIXI.Graphics;

  /** ターゲットロボットテキスト */
  targetRobotText: PIXI.Text;

  /** ロボットテキスト */
  robotTexts: PIXI.Text;

  /** アイコンマーカーアレイ */
  iconMarkers: IconMarker[] = [];

  /** コマンドアイコンマーカーアレイ */
  cmdIconMarkers: IconMarker[] = [];

  /** ロボットオフセットY */
  robotOffsetY: number = this.textMargin + this.targetRobotFontSize - this.fontSize;

  /** ウィドス */
  width: number = this.lineHeight * 3 + this.textMargin;

  /** ロボットサブスクリプション */
  robotSubscription: Subscription;

  /**
   * オブジェクトを構築する。
   *
   * @param viewer ビューワー
   */
  constructor(viewer: BaseViewer) {
    super(viewer);

    this.container = new PIXI.Container();
    this.container.parentGroup = this.viewer.controlGroup;
    this.root.addChild(this.container);

    this.update();

    const that = this;
    this.robotSubscription = this.viewer.getComponent().getRobotService()
      .getObservable()
      .subscribe(data => {
        const currentRobot = that.viewer.getComponent().getRobotService().getById(
          that.robotId
        );
        if (!currentRobot) {
          // current robot is removed.
          if (0 < data.array.length) {
            const robot = data.array[0];
            const robotMarker = that.viewer.getRobotMarker(robot);
            if (robotMarker !== undefined) {
              that.updateControl(robotMarker);
            } else {
              that.hide();
            }
          } else {
            that.hide();
          }
        } else {
          const robotMarker = that.viewer.getRobotMarker(currentRobot);
          if (robotMarker !== undefined) {
            that.updateControl(robotMarker);
          } else {
            that.hide();
          }
        }
      });
  }

  /**
   * コマンドアイコンの作成
   *
   * @param iconname アイコンネーム
   * @param tipname チップネーム
   * @param next サブスクライブコールバック
   */
  createCmdIcon(iconname: string, tipname: string, next: (value: any) => void): void {
    const iconMarker = new IconMarker(
      this.viewer,
      {
        id: this.cmdIconMarkers.length,
        icon: iconname,
        tooltip: tipname
      } as Icon,
      next
    );
    this.cmdIconMarkers.push(iconMarker);
}

  /**
   * コマンドアイコンをアップデートをする。
   */
  updateCmdIcon(): void {
    const that = this;
    if (!this.robotMarker) {
      return;
    }

    if (this.cmdIconMarkers.length === 0) {
      this.createCmdIcon(
        String.fromCharCode(0xe648), // wifi_off
        'wifi',
        () => {}
      );
      this.createCmdIcon(
        String.fromCharCode(0xe242), // format_list_numbered
        'Execute cmdList',
        () => { that.robotMarker.executeCmdListFromDialog(); }
      );
      this.createCmdIcon(
        String.fromCharCode(0xe85d), // assignment
        'Execute roboCmd',
        () => { that.robotMarker.executeRoboCmdFromDialog(); }
      );
      this.createCmdIcon(
        String.fromCharCode(0xe905), // flight_takeoff
        'Execute run_nav',
        () => { that.robotMarker.runNavRoboCmd(); }
      );
      this.createCmdIcon(
        String.fromCharCode(0xe904), // flight_land
        'Execute kill_nav',
        () => { that.robotMarker.killNavRoboCmd(); }
      );
      this.createCmdIcon(
        String.fromCharCode(0xe55f), // place
        'Execute set_pose',
        () => { that.robotMarker.setPoseRoboCmd(); }
      );
      this.createCmdIcon(
        String.fromCharCode(0xe906), // play_for_work
        'Execute goto',
        () => { that.robotMarker.gotoRoboCmd(); }
      );
      this.createCmdIcon(
        String.fromCharCode(0xe047), // stop
        'Execute cancel',
        () => { that.robotMarker.cancelRoboCmd(); }
      );
      this.createCmdIcon(
        '0',
        'Execute CmdList 0',
        () => { that.robotMarker.executeCmdListById(0); }
      );
      this.createCmdIcon(
        '1',
        'Execute CmdList 1',
        () => { that.robotMarker.executeCmdListById(1); }
      );
      this.createCmdIcon(
        '2',
        'Execute CmdList 2',
        () => { that.robotMarker.executeCmdListById(2); }
      );
    }

    const xOffset = this.textMargin;
    let yOffset = this.robotOffsetY + this.lineHeight * 2;
    this.cmdIconMarkers.forEach(element => {
      if (element.isVisibled()) {
        const iconWifiOn = String.fromCharCode(0xe63e); // wifi_on
        const iconWifiOff = String.fromCharCode(0xe648); // wifi_off
        if (
          element.icon.icon === iconWifiOn ||
          element.icon.icon === iconWifiOff
        ) {
          let lastState = that.robotMarker.ros.getState();
          if (lastState === ConnectionState.Connected) {
            element.setText(iconWifiOn);
            element.setFill(this.activeColor);
          } else {
            element.setText(iconWifiOff);
            element.setFill(this.inactiveColor);
          }
          that.robotMarker.ros
            .getStateObservable()
            .subscribe(state => {
              if (state === ConnectionState.Connected) {
                element.setText(iconWifiOn);
                element.setFill(that.activeColor);
              } else {
                element.setText(iconWifiOff);
                element.setFill(that.inactiveColor);
              }
              lastState = state;
            });
        }
        element.updateOffset(xOffset, yOffset);
        yOffset += that.lineHeight;
      }
    });
  }

  /**
   * アップデートする。
   */
  update(): void {
    super.update();
    this.container.x = this.viewer.viewWidth - this.width;
    this.container.y = 0;

    if (this.robotMarker) {
      this.updateBase();
      this.updateRobotIcon();
      this.updateCmdIcon();
    }
  }

  /**
   * コントロールをアップデートをする。
   *
   * @praram ロボットマーカー
   */
  updateControl(robotMarker: RobotMarker): void {
    this.robotMarker = robotMarker;
    this.robotId = this.robotMarker.robot.id;

    // #RRGGBBAA
    const color = this.robotMarker.robot.color;
    this.robotColor = parseInt(color.substring(1, 7), 16);
    this.robotAlpha = parseInt(color.substring(7, 9), 16) / 255.0;

    this.update();
    this.show();
  }

  /**
   * ベースをアップデートをする。
   */
  updateBase(): void {
    // first child to keep most background
    // create once and redraw
    if (!this.background) {
      this.background = new PIXI.Graphics();
      this.container.addChild(this.background);
    }
    this.redrawBackground();

    // recreate
    const targetRobot = this.robotMarker.robot.name;
    if (this.targetRobotText) {
      this.container.removeChild(this.targetRobotText);
    }
    // #RRGGBBAA
    const robotColor = parseInt(this.robotMarker.robot.color.substring(1, 7), 16);
    const targetRobotStyle = new PIXI.TextStyle({
      fontFamily: 'Meiryo UI Regular',
      fontWeight: 'bold',
      fill: this.inactiveColor,
      fontSize: this.targetRobotFontSize,
      stroke: robotColor,
      strokeThickness: this.strokeThickness
    });
    this.targetRobotText = new PIXI.Text(targetRobot, targetRobotStyle);
    this.targetRobotText.x = this.textMargin;
    this.targetRobotText.y = this.textMargin;
    this.container.addChild(this.targetRobotText);
    this.targetRobotText.interactive = true;
  }

  /**
   * ロボットアイコンをアップデートをする。
   */
  updateRobotIcon(): void {
    const that = this;

    this.container.removeChild(this.robotTexts);

    const xOffset = this.textMargin;
    const yOffset = this.robotOffsetY + this.lineHeight;

    const title = String.fromCharCode(0xeb3c); // airport_shuttle;
    const titleStyle = new PIXI.TextStyle({
      fontFamily: 'Material Icons',
      fontWeight: 'normal',
      fill: this.activeColor,
      fontSize: this.iconFontSize
    });
    const adjust = this.iconFontSize - this.fontSize;
    const text = new PIXI.Text(title, titleStyle);
    text.x = xOffset;
    text.y = yOffset - adjust;
    this.container.addChild(text);
    this.robotTexts = text;
    text.interactive = true;
    text.on('pointerdown', () => {
      that.selectTargetRobot();
    });
  }

  /**
   * ターゲットロボットを選択する。
   */
  selectTargetRobot(): void {
    const that = this;
    this.viewer.getComponent().getNgZone().run(() => {
      const robotService = that.viewer.getComponent().getRobotService();
      const options = robotService.getRobots();
      const dialogRef = that.viewer.getComponent().getSelectDialog().open(
        SelectDialogComponent,
        {
          width: '480px',
          data: {
            title: 'Select target robot',
            placeholder: 'Select target robot',
            options,
            selected: options[0]
          }
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        const isCanceled = typeof result === 'undefined';
        if (!isCanceled) {
          const selectedRobot = robotService.getByName(result);
          if (selectedRobot != null) {
            const robotMarker = that.viewer.getRobotMarker(selectedRobot);
            if (robotMarker !== undefined) {
              that.viewer.showControlMarker(robotMarker);
            }
          }
        }
      });
    });
  }

  /**
   * バックグランドをリドローする。
   */
  redrawBackground(): void {
    const g = this.background;
    g.clear();
    g.beginFill(this.robotColor, this.robotAlpha);
    g.drawRect(0, 0, this.width, this.viewer.viewHeight);
    g.endFill();
  }

  /**
   * 表示する。
   */
  show(): void {
    const robots = this.viewer.getComponent().getRobotService().getAll();
    if (0 < robots.length) {
      super.show();
    }
  }

  /**
   * ディスポーズする。
   */
  dispose(): void {
    super.dispose();
    if (this.robotSubscription) {
      this.robotSubscription.unsubscribe();
    }
    this.iconMarkers.forEach(element => element.dispose());
    this.iconMarkers = [];
  }
}

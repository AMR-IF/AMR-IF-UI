/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Renderer2, NgZone, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseViewerComponent } from './base-viewer-component';
import { SettingService } from '../../settings/shared/setting.service';
import { RosService } from '../../shared/ros/ros.service';
import { PoseService } from '../../poses/shared/pose.service';
import { RobotService } from '../../robots/shared/robot.service';
import { CommandService } from '../../commands/shared/command.service';
import { CmdListService } from '../../cmd-lists/shared/cmd-list.service';

/**
 * アブストラクトビューワーコンポーネントです。
 */
export abstract class AbstractViewerComponent implements BaseViewerComponent {
  /** canvasを動的に追加するプレースホルダーとなる要素 */
  abstract canvasesPlaceholderElementRef: ElementRef;

  /** ビューを追加する要素 */
  abstract viewerElementRef: ElementRef;

  /** セッティングサービス */
  abstract settingService: SettingService;

  /** ROSサービス */
  abstract rosService: RosService;

  /** ポーズサービス */
  abstract poseService: PoseService;

  /** ロボットサービス */
  abstract robotService: RobotService;

  /** コマンドサービス */
  abstract commandService: CommandService;

  /** コマンドリストサービス */
  abstract cmdListService: CmdListService;

  /** インプットダイアログ */
  abstract inputDialog: MatDialog;

  /** セレクトダイアログ */
  abstract selectDialog: MatDialog;

  /** レンダラー2 */
  abstract renderer2: Renderer2;

  /** ゾーン */
  abstract ngZone: NgZone;

  /**
   * キャンバスプレースホルダーエレメントリファレンスをゲットする。
   *
   * @return キャンバスプレースホルダーエレメントリファレンス
   */
  getCanvasesPlaceholderElementRef(): ElementRef {
    return this.canvasesPlaceholderElementRef;
  }

  /**
   * ビューワーエレメントリファレンスをゲットする。
   *
   * @return ビューワーエレメントリファレンス
   */
  getViewerElementRef(): ElementRef {
    return this.viewerElementRef;
  }

  /**
   * セッティングサービスをゲットする。
   *
   * @return セッティングサービス
   */
  getSettingService(): SettingService {
    return this.settingService;
  }

  /**
   * ROSサービスをゲットする。
   *
   * @return ROSサービス
   */
  getRosService(): RosService {
    return this.rosService;
  }

  /**
   * ポーズサービスをゲットする。
   *
   * @return ポーズサービス
   */
  getPoseService(): PoseService {
    return this.poseService;
  }

  /**
   * ロボットサービスをゲットする。
   *
   * @return ロボットサービス
   */
  getRobotService(): RobotService {
    return this.robotService;
  }

  /**
   * コマンドサービスをゲットする。
   *
   * @return コマンドサービス
   */
  getCommandService(): CommandService {
    return this.commandService;
  }

  /**
   * コマンドリストサービスをゲットする。
   *
   * @return コマンドリストサービス
   */
  getCmdListService(): CmdListService {
    return this.cmdListService;
  }

  /**
   * インプットダイアログをゲットする。
   *
   * @return ダイアログ
   */
  getInputDialog(): MatDialog {
    return this.inputDialog;
  }

  /**
   * セレクトダイアログをゲットする。
   *
   * @return ダイアログ
   */
  getSelectDialog(): MatDialog {
    return this.selectDialog;
  }

  /**
   * レンダラーをゲットする。
   *
   * @return レンダラー
   */
  getRenderer2(): Renderer2 {
    return this.renderer2;
  }

  /**
   * ゾーンをゲットする。
   *
   * @return ゾーン
   */
  getNgZone(): NgZone {
    return this.ngZone;
  }
}

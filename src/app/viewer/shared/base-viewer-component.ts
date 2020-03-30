/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Renderer2, NgZone, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingService } from '../../settings/shared/setting.service';
import { RosService } from '../../shared/ros/ros.service';
import { PoseService } from '../../poses/shared/pose.service';
import { RobotService } from '../../robots/shared/robot.service';
import { CommandService } from '../../commands/shared/command.service';
import { CmdListService } from '../../cmd-lists/shared/cmd-list.service';

/**
 * ベースビューワーコンポーネントです。
 */
export interface BaseViewerComponent {
  /**
   * キャンバスプレースホルダーエレメントリファレンスをゲットする。
   *
   * @return キャンバスプレースホルダーエレメントリファレンス
   */
  getCanvasesPlaceholderElementRef(): ElementRef;

  /**
   * ビューワーエレメントリファレンスをゲットする。
   *
   * @return ビューワーエレメントリファレンス
   */
  getViewerElementRef(): ElementRef;

  /**
   * セッティングサービスをゲットする。
   *
   * @return セッティングサービス
   */
  getSettingService(): SettingService;

  /**
   * ROSサービスをゲットする。
   *
   * @return ROSサービス
   */
  getRosService(): RosService;

  /**
   * ポーズサービスをゲットする。
   *
   * @return ポーズサービス
   */
  getPoseService(): PoseService;

  /**
   * ロボットサービスをゲットする。
   *
   * @return ロボットサービス
   */
  getRobotService(): RobotService;

  /**
   * コマンドサービスをゲットする。
   *
   * @return コマンドサービス
   */
  getCommandService(): CommandService;

  /**
   * コマンドリストサービスをゲットする。
   *
   * @return コマンドリストサービス
   */
  getCmdListService(): CmdListService;

  /**
   * インプットダイアログをゲットする。
   *
   * @return ダイアログ
   */
  getInputDialog(): MatDialog;

  /**
   * セレクトダイアログをゲットする。
   *
   * @return ダイアログ
   */
  getSelectDialog(): MatDialog;

  /**
   * レンダラーをゲットする。
   *
   * @return レンダラー
   */
  getRenderer2(): Renderer2;

  /**
   * ゾーンをゲットする。
   *
   * @return ゾーン
   */
  getNgZone(): NgZone;
}

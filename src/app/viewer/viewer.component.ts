/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import {
  Component, AfterViewInit, AfterViewChecked, OnDestroy,
  ViewChild, HostListener, Renderer2, NgZone, ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RosService } from '../shared/ros/ros.service';
import { RobotService } from '../robots/shared/robot.service';
import { PoseService } from '../poses/shared/pose.service';
import { SettingService } from '../settings/shared/setting.service';
import { CmdListService } from '../cmd-lists/shared/cmd-list.service';
import { CommandService } from '../commands/shared/command.service';
import { StoreService } from '../shared/store/store.service';
import { Viewer } from './shared/viewer';
import { KeyValueStore } from '../shared/store/key-value-store';
import { AbstractViewerComponent } from './shared/abstract-viewer-component';

/**
 * ビューワーコンポーネントです。
 */
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent extends AbstractViewerComponent
  implements AfterViewInit, AfterViewChecked, OnDestroy {
  /** ストレージキー */
  storageKey: string = 'amr-if-ui' + '-view';

  /** キーバリューストア */
  keyValueStore: KeyValueStore;

  /** ビューワー */
  viewer: Viewer;

  /** canvasを動的に追加するプレイスホルダーとなる要素 */
  @ViewChild('canvasesPlaceholderElement', {static: false})
  canvasesPlaceholderElementRef: ElementRef;

  /** ビューを追加する要素 */
  @ViewChild('viewerElement', {static: false})
  viewerElementRef: ElementRef;

  /**
   * オブジェクトを構築する。
   *
   * @param storeService ストアサービス
   * @param settingService セッティングサービス
   * @param rosService ROSサービス
   * @param poseService ポーズサービス
   * @param robotService ロボットサービス
   * @param commandService コマンドサービス
   * @param cmdListService コマンドリストサービス
   * @param inputDialog インプットダイアログ
   * @param selectDialog セレクトダイアログ
   * @param renderer2 レンダラー2
   * @param ngZone ゾーン
   */
  constructor(
    public storeService: StoreService,
    public settingService: SettingService,
    public rosService: RosService,
    public poseService: PoseService,
    public robotService: RobotService,
    public commandService: CommandService,
    public cmdListService: CmdListService,
    public inputDialog: MatDialog,
    public selectDialog: MatDialog,
    public renderer2: Renderer2,
    public ngZone: NgZone
  ) {
    super();
    this.keyValueStore = storeService.getKeyValueStore();
  }

  /**
   * コンポーネントのビューが初期化された後に処理を行う。
   *
   * ビューを作成してビューのcanvas要素を追加する。
   */
  ngAfterViewInit(): void {
    const that = this;
    this.ngZone.runOutsideAngular(() => {
      that.viewer = new Viewer(that);
      that.getViewerElementRef().nativeElement.appendChild(that.viewer.getView());
      this.keyValueStore.get(that.storageKey).then(value => {
        const restoredView = JSON.parse(value);
        if (restoredView) {
          Object.assign(that.viewer.state, restoredView);
          that.viewer.restoreState();
        }
        const robots = that.viewer.component.getRobotService().getAll();
        if (0 < robots.length) {
          const robot = robots[0];
          const robotMarker = that.viewer.getRobotMarker(robot);
          if (robotMarker !== undefined) {
            that.viewer.showControlMarker(robotMarker);
          }
        }
      });
    });
  }

  /**
   * コンポーネントのビューがチェックされた後に処理を行う。
   */
  ngAfterViewChecked(): void {
    if (
      this.viewer.viewWidth !== this.getViewerElementRef().nativeElement.offsetWidth ||
      this.viewer.viewHeight !== this.getViewerElementRef().nativeElement.offsetHeight
    ) {
      this.viewer.onResize();
    }
  }

  /**
   * コンポーネントを破棄する。
   *
   * ビューをアンサブスクライブする。
   */
  ngOnDestroy(): void {
    this.storeState();
    this.viewer.destroy();
  }

  /**
   * ステートをストアする。
   */
  storeState(): void {
    const stateJson = JSON.stringify(this.viewer.state);
    this.keyValueStore.set(this.storageKey, stateJson);
  }

  /**
   * ウィンドウリサイズのイベントをハンドリングする。
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.viewer.onResize();
  }

  /**
   * キーダウンのイベントをハンドリングする。
   *
   * @param event イベント
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.viewer.onKeyDown(event);
    this.storeState();
  }
}

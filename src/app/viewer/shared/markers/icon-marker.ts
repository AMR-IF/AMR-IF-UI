/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Subscription, Subject, Observable } from 'rxjs';
import { BaseViewer } from '../base-viewer';
import { BaseMarker } from './base-marker';
import { ControlMarker } from './control-marker';
import { Icon } from './icon.model';

/**
 * アイコンマーカーです。
 */
export class IconMarker extends BaseMarker {
  /** コントロールマーカー */
  controlMarker: ControlMarker;

  /** アイコン */
  icon: Icon;

  /** アイコンラウンドラディウス */
  radius = 2;

  /** Xアジャスト */
  xAdjust = 0;

  /** Yアジャスト */
  yAdjust = 0;

  /** コンテナ */
  container: PIXI.Container;

  /** テキスト */
  text: PIXI.Text;

  /** バックグラウンド */
  background: PIXI.Graphics;

  /** テキストメトリクス */
  textMetrics: PIXI.TextMetrics;

  /** イベントサブジェクト */
  eventSubject: Subject<any> = new Subject();

  /** イベントオブザーバブル */
  eventObservable: Observable<any> = this.eventSubject.asObservable();

  /** サブスクリプション */
  subscription: Subscription;

  /**
   * オブジェクトを構築する。
   *
   * @param viewer ビューワー
   * @param icon アイコン
   * @param next サブスクライブコールバック
   */
  constructor(viewer: BaseViewer, icon: Icon, next: (value: any) => void) {
    super(viewer);
    this.icon = icon;

    this.controlMarker = this.viewer.controlMarker;
    this.controlMarker.iconMarkers.push(this);

    this.container = new PIXI.Container();
    this.controlMarker.container.addChild(this.container);

    this.background = new PIXI.Graphics();
    this.container.addChild(this.background);

    const that = this;
    let style;
    const regex = new RegExp(/[a-zA-Z0-9]/);
    if (regex.test(icon.icon)) {
      style = new PIXI.TextStyle({
        fontFamily: 'Meiryo UI Regular',
        fontWeight: 'normal',
        fill: this.controlMarker.activeColor,
        fontSize: this.controlMarker.iconFontSize - 4
      });
      this.textMetrics = PIXI.TextMetrics.measureText(icon.icon, style);
      this.xAdjust =
        (this.controlMarker.iconFontSize - this.textMetrics.width) / 2;
      this.textMetrics.width = 24;
      this.yAdjust =
        (this.controlMarker.iconFontSize - this.textMetrics.height) / 2;
      this.textMetrics.height = 29;
    } else {
      style = new PIXI.TextStyle({
        fontFamily: 'Material Icons',
        fontWeight: 'normal',
        fill: this.controlMarker.activeColor,
        fontSize: this.controlMarker.iconFontSize
      });
      this.textMetrics = PIXI.TextMetrics.measureText(icon.icon, style);
    }
    this.text = new PIXI.Text(icon.icon, style);
    this.container.addChild(this.text);
    this.background.interactive = true;
    this.background
      .on('pointerup', (event: any) => {
        that.eventSubject.next(event);
      });

    this.subscription = this.eventObservable.subscribe(next);
  }

  /**
   * オフセットをアップデートする。
   *
   * @param xOffset Xオフセット
   * @param yOffset Yオフセット
   */
  updateOffset(xOffset: number, yOffset: number): void {
    if (this.background) {
      this.background.x = xOffset;
      this.background.y = yOffset;
    }
    if (this.text) {
      this.text.x = this.xAdjust + this.radius + xOffset;
      this.text.y = this.yAdjust + this.radius + yOffset;
    }
    this.redrawBackground();
  }

  /**
   * バックグランドをリドローする。
   */
  redrawBackground(): void {
    const g = this.background;
    g.clear();
    if (this.textMetrics) {
      g.beginFill(0xa0a0a0, 0.5);
      const iconSize = this.textMetrics.width + this.radius * 2;
      g.drawRoundedRect(0, 0, iconSize, iconSize, this.radius * 4);
      g.endFill();
    }
  }

  /**
   * テキストをセットする。
   *
   * @param text テキスト
   */
  setText(text: string): void {
    if (this.text) {
      this.text.text = text;
      this.redrawBackground();
    }
  }

  /**
   * フィルをセットする。
   *
   * @param fill フィル
   */
  setFill(fill: number): void {
    if (this.text) {
      this.text.style.fill = fill;
      this.redrawBackground();
    }
  }

  /**
   * ディスポーズする。
   */
  dispose(): void {
    super.dispose();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

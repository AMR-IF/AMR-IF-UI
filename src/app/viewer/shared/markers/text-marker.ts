/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { BaseViewer } from '../base-viewer';
import { OrientationMarker } from './orientation-marker';
import { TextPosition } from '../text-position.enum';

/**
 * テキストマーカーです。
 */
export class TextMarker extends OrientationMarker {
  /** メッセージ */
  message: string;

  /** フィルカラー */
  fillColor: number;

  /** コンテナ */
  container: PIXI.Container;

  /** バックグラウンド */
  background: PIXI.Graphics;

  /** テキスト */
  text: PIXI.Text;

  /** テキストメトリクス */
  textMetrics: PIXI.TextMetrics;

  /** ポジション */
  position: TextPosition;

  /**
   * オブジェクトを構築する。
   *
   * @param viewer ビューワー
   */
  constructor(viewer: BaseViewer) {
    super(viewer);

    this.message = '';
    this.fillColor = 0;
    this.position = TextPosition.Above;

    this.container = new PIXI.Container();
    this.background = new PIXI.Graphics();
    this.container.addChild(this.background);
    this.rosWorld.addChild(this.container);

    this.updateTransform();
  }

  /**
   * ポジションをセットする。
   *
   * @param position ポジション
   */
  setTextPosition(position: TextPosition): void {
    if (this.position !== position) {
      this.updateText();
    }
    this.position = position;
  }

  /**
   * メッセージを指定してテキストをセットしてアップデートする。
   *
   * @param message メッセージ
   */
  setText(message: string): void {
    this.message = message;
    this.updateText();
  }

  /**
   * テキストをアップデートする。
   */
  updateText(): void {
    const message = this.message;
    if (message.length !== 0) {
      if (this.text) {
        this.container.removeChild(this.text);
      }

      const fontSize = this.viewer.getComponent().getSettingService().getFontSize();
      const style = new PIXI.TextStyle({
        fontFamily: 'Meiryo UI Regular',
        fontWeight: 'bold',
        fontSize,
        fill: this.fillColor
      });

      const alpha = 0.5;
      this.text = new PIXI.Text(message, style);
      this.text.interactive = true;
      this.text.alpha = alpha;
      const textMetrics = PIXI.TextMetrics.measureText(message, style);
      this.textMetrics = textMetrics;

      const offset = fontSize;

      switch (this.position) {
        case TextPosition.Above:
          this.text.x = -textMetrics.width / 2;
          this.text.y = -textMetrics.height - offset;
          break;
        case TextPosition.Below:
          this.text.x = -textMetrics.width / 2;
          this.text.y = offset;
          break;
        case TextPosition.Left:
          this.text.x = -textMetrics.width - offset;
          this.text.y = -textMetrics.height / 2;
          break;
        case TextPosition.Right:
          this.text.x = offset;
          this.text.y = -textMetrics.height / 2;
          break;
        case TextPosition.Center:
          this.text.x = -textMetrics.width / 2;
          this.text.y = -textMetrics.height / 2;
          break;
      }

      this.container.addChild(this.text);
      this.redraw();
    }
  }

  /**
   * フィルカラーをセットする。
   *
   * @param fillColor フィルカラー
   */
  setFillColor(fillColor: number): void {
    this.fillColor = fillColor;
    if (this.text) {
      this.text.style.fill = this.fillColor;
    }
  }

  /**
   * バッググラウンドをリドローする。
   *
   * テキストのサイズにマージンを加えたサイズでバッググラウンドを描画する。
   */
  redraw(): void {
    const backgroundColor = 0;
    const backgroundAlpha = 0;
    const backgroundMargin = 10;

    const g = this.background;
    g.clear();
    g.beginFill(backgroundColor, backgroundAlpha);
    g.drawRect(
      this.text.x - backgroundMargin,
      this.text.y - backgroundMargin,
      this.textMetrics.width + 2 * backgroundMargin,
      this.textMetrics.height + 2 * backgroundMargin
    );
    g.endFill();
  }

  /**
   * ビューが変化した際にアップデートする。
   */
  update(): void {
    super.update();
    this.updateTransform();
  }

  /**
   * トランスフォームにアップデートする。
   */
  updateTransform(): void {
    let theta = this.viewer.getRotationRadian();
    if (Math.abs(Math.sin(theta)) === 1) {
      theta += Math.PI;
    }
    this.container.setTransform(0, 0, 1, -1, theta, 0, 0, 0, 0);
  }
}

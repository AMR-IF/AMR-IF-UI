/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { BaseViewer } from '../base-viewer';
import { BaseMarker } from './base-marker';

/**
 * Rosマーカーです。
 */
export class RosMarker extends BaseMarker {
  /** Rosワールドコンテナ */
  rosWorld: PIXI.Container;

  /** スケーリングRosワールドコンテナ */
  rosWorldScale: PIXI.Container;

  /**
   * オブジェクトを構築する。
   *
   * RosワールドコンテナをビューワーのRosワールドコンテナに追加する。
   * スケーリングRosワールドコンテナをビューワーのスケーリングRosワールドコンテナに追加する。
   *
   * コンテナの親子関係
   * Viewer.root -> BaseMarker.root
   * Viewer.rosWorld -> RosMarker.rosWorld
   * Viewer.rosWorldScale -> RosMarker.rosWorldScale
   *
   * @param viewer ビューワー
   */
  constructor(viewer: BaseViewer) {
    super(viewer);
    this.rosWorld = new PIXI.Container();
    this.viewer.rosWorld.addChild(this.rosWorld);
    this.rosWorldScale = new PIXI.Container();
    this.viewer.rosWorldScale.addChild(this.rosWorldScale);
  }

  /**
   * 表示する。
   *
   * Rosワールドコンテナを表示する。
   * スケーリングRosワールドコンテナを表示する。
   */
  show(): void {
    super.show();
    this.rosWorld.visible = true;
    this.rosWorldScale.visible = true;
  }

  /**
   * 非表示にする。
   *
   * Rosワールドコンテナを非表示にする。
   * スケーリングRosワールドコンテナを非表示にする。
   */
  hide(): void {
    super.hide();
    this.rosWorld.visible = false;
    this.rosWorldScale.visible = false;
  }

  /**
   * 削除する。
   *
   * RosワールドコンテナをビューワーのRosワールドコンテナから削除する。
   * スケーリングRosワールドコンテナをビューワーのスケーリングRosワールドコンテナから削除する。
   */
  remove(): void {
    super.remove();
    this.viewer.rosWorld.removeChild(this.rosWorld);
    this.viewer.rosWorldScale.removeChild(this.rosWorldScale);
  }
}

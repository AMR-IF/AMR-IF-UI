/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { BaseViewer } from '../base-viewer';
import { RosMarker } from './ros-marker';

/**
 * グリッドマーカーです。
 */
export class GridMarker extends RosMarker {
  /** コンテナ */
  container: PIXI.Container;

  /** XYグリッド */
  xyGrid: PIXI.Graphics;

  /**
   * オブジェクトを構築する。
   *
   * @param viewer ビューワー
   */
  constructor(viewer: BaseViewer) {
    super(viewer);

    this.container = new PIXI.Container();
    this.xyGrid = new PIXI.Graphics();
    this.container.addChild(this.xyGrid);
    this.container.parentGroup = this.viewer.gridGroup;
    this.rosWorld.addChild(this.container);

    this.redraw();
  }

  /**
   * グリッドを描画する。
   */
  redraw(): void {
    const pixelPerMeter = this.viewer.resolution;
    const gridSize = 100;
    const alpha = 0.5;
    const color = 0x000000;
    const lineWidth = 1;
    const width = pixelPerMeter * gridSize;
    const height = pixelPerMeter * gridSize;

    const xyGrid = this.xyGrid;
    xyGrid.clear();
    xyGrid.lineStyle(lineWidth, color, alpha);

    // x-Grid
    xyGrid.moveTo(-width, 0);
    xyGrid.lineTo(width, 0);
    for (let y = pixelPerMeter; y < height; y += pixelPerMeter) {
      xyGrid.moveTo(-width, y);
      xyGrid.lineTo(width, y);
    }
    for (let y = -pixelPerMeter; y > -height; y -= pixelPerMeter) {
      xyGrid.moveTo(-width, y);
      xyGrid.lineTo(width, y);
    }

    // y-Grid
    xyGrid.moveTo(0, -height);
    xyGrid.lineTo(0, height);
    for (let x = pixelPerMeter; x < width; x += pixelPerMeter) {
      xyGrid.moveTo(x, -height);
      xyGrid.lineTo(x, height);
    }
    for (let x = -pixelPerMeter; x > -width; x -= pixelPerMeter) {
      xyGrid.moveTo(x, -height);
      xyGrid.lineTo(x, height);
    }
  }

  /**
   * ビューが変化した際にアップデートする。
   *
   * リドローする。
   */
  update(): void {
    this.redraw();
  }
}

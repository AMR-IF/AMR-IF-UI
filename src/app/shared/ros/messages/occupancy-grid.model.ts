/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { MapMetaData } from './map-meta-data.model';

/**
 * オキュパンシーグリッドです。
 * @see http://docs.ros.org/kinetic/api/nav_msgs/html/msg/OccupancyGrid.html
 */
export interface OccupancyGrid {
  /** ヘッダー */
  header: any;

  /** MetaData for the map */
  info: MapMetaData;

  /** The map data, in row-major order, starting with (0,0). Occupancy probabilities are in the range [0,100]. Unknown is -1. */
  data: Int8Array;
}

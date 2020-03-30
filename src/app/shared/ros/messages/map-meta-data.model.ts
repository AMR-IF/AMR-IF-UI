/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import * as ROSLIB from 'roslib';

/**
 * MapMetaDataメッセージです。
 * @see http://docs.ros.org/kinetic/api/nav_msgs/html/msg/MapMetaData.html
 */
export interface MapMetaData {
  /** The map resolution [m/cell] */
  resolution: number;

  /** Map width [cells] */
  width: number;

  /** Map height [cells] */
  height: number;

  /** The origin of the map [m, m, rad].  This is the real-world pose of the cell (0,0) in the map. */
  origin: ROSLIB.Pose;
}

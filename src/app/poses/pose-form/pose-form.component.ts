/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, OnInit, Input } from '@angular/core';
import { Pose } from '../shared/pose.model';
import { MaterialColor } from '../../shared/material-color';
import { MaterialColorOptions } from '../../shared/material-color-options';

/**
 * ポーズのフォームを表示するコンポーネントです。
 */
@Component({
  selector: 'app-pose-form',
  templateUrl: './pose-form.component.html',
  styleUrls: ['./pose-form.component.css']
})
export class PoseFormComponent implements OnInit {
  /** ポーズ */
  @Input()
  edit: Pose;

  /** ヨー */
  yaw = 0;

  /** 候補として表示するネームのオプション */
  nameOptions: string[] = [];

  /** 候補として表示するカラーのオプション */
  colorOptions: MaterialColor[] = MaterialColorOptions.colorOptions;

  /**
   * オブジェクトを構築する
   */
  constructor() {}

  /**
   * コンポーネントを初期化する。
   */
  ngOnInit(): void {
    this.yaw = this.toDegree(this.toEulerAngle(this.edit.rospose.orientation).yaw);
  }

  /**
   * yawの値が変化した際にコールバックされる。
   */
  onChangeYaw(): void {
    const eulerAngle = {
      roll: 0,
      pitch: 0,
      yaw: this.toEuler(this.yaw)
    };
    this.edit.rospose.orientation = this.toQuaternion(eulerAngle);
  }

  /**
   * オイラーアングルをクォータニオンに変換する。
   *
   * @param eularAngle オイラーアングル
   * @return クォータニオン
   */
  toQuaternion(eularAngle: {
    roll: number;
    pitch: number;
    yaw: number;
  }): ROSLIB.Quaternion {
    const cy = Math.cos(eularAngle.yaw * 0.5);
    const sy = Math.sin(eularAngle.yaw * 0.5);
    const cr = Math.cos(eularAngle.roll * 0.5);
    const sr = Math.sin(eularAngle.roll * 0.5);
    const cp = Math.cos(eularAngle.pitch * 0.5);
    const sp = Math.sin(eularAngle.pitch * 0.5);

    return {
      w: cy * cr * cp + sy * sr * sp,
      x: cy * sr * cp - sy * cr * sp,
      y: cy * cr * sp + sy * sr * cp,
      z: sy * cr * cp - cy * sr * sp
    } as ROSLIB.Quaternion;
  }

  /**
   * クォータニオンをオイラーアングルに変換する。
   *
   * @param q クォータニオン
   * @return オイラーアングル
   */
  toEulerAngle(
    q: ROSLIB.Quaternion
  ): {
    roll: number;
    pitch: number;
    yaw: number;
  } {
    // roll (x-axis rotation)
    const sinr = +2.0 * (q.w * q.x + q.y * q.z);
    const cosr = +1.0 - 2.0 * (q.x * q.x + q.y * q.y);
    const roll = Math.atan2(sinr, cosr);
    let pitch;

    // pitch (y-axis rotation)
    const sinp = +2.0 * (q.w * q.y - q.z * q.x);
    if (Math.abs(sinp) >= 1) {
      pitch = 0 < sinp ? Math.PI / 2 : -Math.PI / 2;
    } else {
      pitch = Math.asin(sinp);
    }

    // yaw (z-axis rotation)
    const siny = +2.0 * (q.w * q.z + q.x * q.y);
    const cosy = +1.0 - 2.0 * (q.y * q.y + q.z * q.z);
    const yaw = Math.atan2(siny, cosy);

    return {
      roll,
      pitch,
      yaw
    };
  }

  /**
   * ラジアンをディグリーに変換する。
   *
   * @param eular ラジアン
   * @return ディグリー
   */
  toDegree(eular: number): number {
    return (eular * 180) / Math.PI;
  }

  /**
   * ディグリーをラジアンに変換する。
   *
   * @param degree ディグリー
   * @return ラジアン
   */
  toEuler(degree: number): number {
    return (degree * Math.PI) / 180;
  }
}

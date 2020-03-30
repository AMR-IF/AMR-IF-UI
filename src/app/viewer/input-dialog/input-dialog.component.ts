/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputDialogData } from './input-dialog-data';

/**
 * インプットダイアログのコンポーネントです。
 */
@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css']
})
export class InputDialogComponent {
  /**
   * オブジェクトを構築する。
   *
   * @param dialogRef ダイアログのリファレンス
   * @param data ダイアログデータ
   */
  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData
  ) {}

  /**
   * ダイアログのOkボタンが押下された際にコールバックされる。
   */
  onOkClick(): void {
    const inputed = this.data.inputed;
    this.dialogRef.close(inputed);
  }

  /**
   * ダイアログのCancelボタンが押下された際にコールバックされる。
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }
}

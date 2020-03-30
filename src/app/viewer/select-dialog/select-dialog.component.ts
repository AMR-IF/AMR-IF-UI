/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectDialogData } from './select-dialog-data';

/**
 * セレクトダイアログのコンポーネントです。
 */
@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.css']
})
export class SelectDialogComponent {
  /**
   * オブジェクトを構築する。
   *
   * @param dialogRef ダイアログのリファレンス
   * @param data ダイアログデータ
   */
  constructor(
    public dialogRef: MatDialogRef<SelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectDialogData
  ) {}

  /**
   * ダイアログのOkボタンが押下された際にコールバックされる。
   */
  onOkClick(): void {
    const selected = this.data.selected;
    this.dialogRef.close(selected);
  }

  /**
   * ダイアログのCancelボタンが押下された際にコールバックされる。
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }
}

/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, OnInit, Input } from '@angular/core';
import { CmdList } from '../shared/cmd-list.model';
import { CommandService } from '../../commands/shared/command.service';

/**
 * コマンドリストのフォームを表示するコンポーネントです。
 */
@Component({
  selector: 'app-cmd-list-form',
  templateUrl: './cmd-list-form.component.html',
  styleUrls: ['./cmd-list-form.component.css']
})
export class CmdListFormComponent implements OnInit {
  /** コマンドリスト */
  @Input()
  edit: CmdList;

  /** 候補として表示するネームのオプション */
  nameOptions: string[] = [];

  /**
   * オブジェクトを構築する
   *
   * @param commandService コマンドサービス
   */
  constructor(
    private commandService: CommandService
  ) {}

  /**
   * コンポーネントを初期化する。
   */
  ngOnInit(): void {
    this.commandService.clear().then(() => {
      this.commandService.setArray(this.edit.commands);
    });
  }
}

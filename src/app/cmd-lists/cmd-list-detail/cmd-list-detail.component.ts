/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CmdList } from '../shared/cmd-list.model';
import { CmdListService } from '../shared/cmd-list.service';
import { StorageDetail } from '../../shared/storage/storage-detail';
import { CommandService } from '../../commands/shared/command.service';

/**
 * コマンドリストの詳細を表示するコンポーネントです。
 */
@Component({
  selector: 'app-cmd-list-detail',
  templateUrl: './cmd-list-detail.component.html',
  styleUrls: ['./cmd-list-detail.component.css']
})
export class CmdListDetailComponent extends StorageDetail<CmdList, CmdListService> {
  /** コマンドリスト */
  @Input()
  model: CmdList;

  /**
   * オブジェクトを構築する。
   *
   * @param service サービス
   * @param route ルート
   * @param location ロケーション
   * @param commandService コマンドサービス
   */
  constructor(
    public service: CmdListService,
    public route: ActivatedRoute,
    public location: Location,
    public commandService: CommandService
  ) {
    super();
  }

  /**
   * 編集結果をアップデートする。
   *
   * 編集結果をモデルに反映させてストレージにストアして元の場所に戻る。
   *
   * @return プロミス
   */
  async update(): Promise<void> {
    this.edit.commands = this.commandService.getAll();
    await super.update();
  }
}

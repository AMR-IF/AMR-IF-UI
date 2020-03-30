/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Renderer2 } from '@angular/core';
import { CmdList } from './shared/cmd-list.model';
import { CmdListService } from './shared/cmd-list.service';
import { StorageComponent } from '../shared/storage/storage-component';
import { Command } from '../commands/shared/command.model';
import { CommandService } from '../commands/shared/command.service';
import { StoreService } from '../shared/store/store.service';

/**
 * コマンドリストのコンポーネントです。
 */
@Component({
  selector: 'app-cmd-lists',
  templateUrl: './cmd-lists.component.html',
  styleUrls: ['./cmd-lists.component.css']
})
export class CmdListsComponent extends StorageComponent<CmdList, CmdListService> {
  /** ダウンロードプレフィックスネーム */
  downloadPrefixName = 'cmd-lists';

  /**
   * オブジェクトを構築する。
   *
   * @param service コマンドリストサービス
   * @param commandService コマンドサービス
   * @param renderer2 レンダラー2
   * @param storeService ストアサービス
   */
  constructor(
    public service: CmdListService,
    public storeService: StoreService,
    public commandService: CommandService,
    public renderer2: Renderer2
  ) {
    super();
  }

  /**
   * コマンドを文字列に変換する。
   *
   * @param commands コマンドリスト
   * @return コマンドリスト文字列表現
   */
  toString(commands: Command[]): string {
    let text = '';
    for (let i = 0; i < commands.length; i++) {
      if (i !== 0) {
        text += ', ';
      }
      text += commands[i].command.cmd;
    }
    return text;
  }

  /**
   * コマンドを指定文字以内の文字列に変換する。
   *
   * @param commands コマンドリスト
   * @param commands コマンドリスト
   * @return コマンドリスト文字列表現
   */
  toStringBrief(commands: Command[], maxLength: number): string {
    let text = this.toString(commands);
    if (maxLength < text.length) {
      text = text.substring(0, maxLength - 3);
      text += '...';
    }
    return text;
  }

  /**
   * フォームに入力された新規アイテムを追加する。
   *
   * 編集されたコマンドを取得して追加後にクリアする。
   */
  async add(): Promise<any> {
    this.edit.commands = this.commandService.getAll();
    const result = await super.add();
    await this.commandService.clear();
    await this.commandService.setArray(this.edit.commands);
    return result;
  }
}

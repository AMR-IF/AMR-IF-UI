/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Injectable } from '@angular/core';
import { CmdList } from './cmd-list.model';
import { Command } from '../../commands/shared/command.model';
import { BaseStorage } from '../../shared/storage/base-storage';
import { CommandService } from '../../commands/shared/command.service';
import { StoreService } from '../../shared/store/store.service';

/**
 * コマンドリストサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class CmdListService extends BaseStorage<CmdList> {
  /** ストレージキー */
  static readonly STORAGE_KEY = 'amr-if-ui' + '-cmd-lists';

  /**
   * オブジェクトを構築する。
   *
   * @param storeService ストアサービス
   * @param commandService コマンドサービス
   */
  constructor(
    public storeService: StoreService,
    private commandService: CommandService
  ) {
    super(CmdListService.STORAGE_KEY, storeService.getKeyValueStore());
  }

  /**
   * 空のモデルを取得する。
   *
   * @return 空のモデル
   */
  getEmptyModel(): CmdList {
    return {
      name: '',
      mode: 'custom',
      commands: [this.commandService.getEmptyModel()]
    } as CmdList;
  }

  /**
   * バリデートする。
   *
   * @param edit エディットされたモデル
   * @return バリデートリザルト
   */
  validate(edit: CmdList): boolean {
    // check empty fields
    if (!edit.name) {
      this.showErrorMessage('Failed validation. The name field is required.');
      return false;
    }
    for (const element of edit.commands) {
      if (!this.commandService.validate(element)) {
        return false;
      }
    }
    const unique = this.getByName(edit.name);
    if (unique) {
      if (unique.id !== edit.id) {
        this.showErrorMessage('Failed validation. The same name already exists.');
        return false;
      }
    }
    return true;
  }

  /**
   * ネームが一致するデータを取得する。
   *
   * @param name ネーム
   * @return ネームが一致するデータ
   */
  getByName(name: string): CmdList | undefined {
    return this.getAll().find(element => element.name === name);
  }

  /**
   * コマンドリストを取得する。
   *
   * @return コマンドリストオプション
   */
  getCmdLists(): string[] {
    const cmdlists: string[] = [];
    this.getAll().forEach(cmdlist => cmdlists.push(cmdlist.name));
    return cmdlists;
  }

  /**
   * JOSNからデータをリストアする。
   * オーバーライドして互換性のないデータを修復してから読み込むようにする。
   *
   * @param json JSON文字列
   */
  restoreFromJSON(json: string): void {
    const object = JSON.parse(json);

    // convert
    object.array.forEach((element: CmdList) => {
      element.mode = 'custom';
      element.commands
        .filter(command => command.command.cmd === 'goto')
        .forEach((command: Command) => {
          if (command.command.params.length === 2) {
            command.command.params.push('');
            command.command.params.push('');
          }
        });
    });

    this.restoreFromObject(object);
  }
}

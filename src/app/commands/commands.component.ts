/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Component, Renderer2 } from '@angular/core';
import { Command } from './shared/command.model';
import { CommandService } from './shared/command.service';
import { SettingService } from '../settings/shared/setting.service';
import { StorageComponent } from '../shared/storage/storage-component';
import { StoreService } from '../shared/store/store.service';

/**
 * コマンドのコンポーネントです。
 */
@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent extends StorageComponent<Command, CommandService> {
  /** ダウンロードプレフィックスネーム */
  downloadPrefixName = 'commands';

  /** 候補として表示するコマンドのオプション */
  cmds: string[] = [];

  /**
   * オブジェクトを構築する。
   *
   * @param settingService 設定サービス
   * @param service コマンドサービス
   * @param storeService ストアサービス
   * @param renderer2 レンダラー2
   */
  constructor(
    public settingService: SettingService,
    public service: CommandService,
    public storeService: StoreService,
    public renderer2: Renderer2
  ) {
    super();
    this.cmds = this.service.getCmds();
  }

  /**
   * 前に移動する。
   *
   * @param command コマンド
   */
  movePrev(command: Command): void {
    this.service.movePrev(command);
  }

  /**
   * 後ろに移動する。
   *
   * @param command コマンド
   */
  moveNext(command: Command): void {
    this.service.moveNext(command);
  }

  /**
   * 前にインサートする。
   *
   * @param command コマンド
   */
  insertPrev(command: Command): void {
    const newModel = this.service.getEmptyModel();
    this.service.insertPrev(newModel, command);
  }

  /**
   * 次にインサートする。
   *
   * @param command コマンド
   */
  insertNext(command: Command): void {
    const newModel = this.service.getEmptyModel();
    this.service.insertNext(newModel, command);
  }

  /**
   * リムーブする。
   *
   * @param command コマンド
   */
  remove(command: Command): void {
    if (1 < this.service.getAll().length) {
      this.service.remove(command);
    }
  }

  /**
   * インデックスを取得する。
   *
   * @param command コマンド
   * @return インデックス
   */
  indexOf(command: Command): number {
    return this.service.indexOf(command);
  }

  /**
   * ヒントを取得する。
   *
   * @param command コマンド
   * @param index インデックス
   * @return ヒント
   */
  getHint(command: Command, index: number): string {
    return this.service.getHint(command.command.cmd, index);
  }

  /**
   * オートコンプリートを取得する。
   *
   * @param command コマンド
   * @param index インデックス
   * @return オートコンプリート
   */
  getAutocomplete(command: Command, index: number): string[] {
    return this.service.getAutocomplete(command.command.cmd, index);
  }

  /**
   * データをクリアする。
   */
  async clear(): Promise<void> {
    await super.clear();
    const newModel = this.service.getEmptyModel();
    await this.service.add(newModel);
  }

  /**
   * 値が変化した際にコールバックされる。
   */
  onChange(): void {
    this.service.store();
  }

  /**
   * 値が変化した際にコールバックされる。
   *
   * @param event イベント
   * @param command コマンド
   */
  onChangeCmd(event: any, command: Command): void {
    const commandsInfo = this.service
      .getCommandsInfo()
      .filter(element => element.cmd === event);
    if (commandsInfo && 0 < commandsInfo.length) {
      const count = commandsInfo[0].paramCount;
      command.command.params = [];
      for (let i = 0; i < count; i++) {
        const autocomplete = this.getAutocomplete(command, i);
        if (0 < autocomplete.length) {
          command.command.params.push(autocomplete[0]);
        } else {
          command.command.params.push('');
        }
      }
    } else {
      command.command.params = [];
    }
    this.onChange();
  }

  /**
   * インデックスでトラックする。
   *
   * @param index インデックス
   * @return トラック
   */
  trackByFn(index: number): any {
    return index;
  }
}

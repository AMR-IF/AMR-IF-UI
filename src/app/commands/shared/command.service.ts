/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Command } from './command.model';
import { CommandInfo } from './command-info.model';
import { BaseStorage } from '../../shared/storage/base-storage';
import { Protocol } from '../../viewer/shared/protocol/protocol.model';
import { RobotCommand } from '../../viewer/shared/protocol/robot-command-request.model';
import { PoseService } from '../../poses/shared/pose.service';
import { StoreService } from '../../shared/store/store.service';

/**
 * コマンドサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class CommandService extends BaseStorage<Command> {
  /** ストレージキー */
  static readonly STORAGE_KEY = 'amr-if-ui' + '-commands';

  /** コマンドインフォアレイ */
  commandsInfo: CommandInfo[] = [];

  /**
   * オブジェクトを構築する。
   *
   * @param storeService ストアサービス
   * @param poseService ポーズサービス
   */
  constructor(
    public storeService: StoreService,
    public poseService: PoseService
  ) {
    super(CommandService.STORAGE_KEY, storeService.getKeyValueStore());
  }

  /**
   * 初期化する。
   *
   * @return プロミス
   */
  async initialize(): Promise<boolean> {
    const ret = await super.initialize();
    const config = environment.config;
    config.protocols
      .filter(
        (element: Protocol) =>
          element.request.messageType === 'trr_msgs/RoboCmd' &&
          element.response.messageType === 'trr_msgs/RoboRes'
      )
      .forEach((element: Protocol) => {
        const type = element.type;
        const request = element.request.topic;
        const response = element.response.topic;

        element.request.messages.forEach((message: RobotCommand) => {
          const cmd = message.cmd;
          const paramCount = message.params.length;
          if (paramCount === 0) {
            const paramIndex = 0;
            const commandInfo = {
              type,
              request,
              response,
              cmd,
              paramCount,
              paramIndex,
              param: '',
              autocomplete: []
            } as CommandInfo;
            this.commandsInfo.push(commandInfo);
          } else {
            for (let paramIndex = 0; paramIndex < paramCount; paramIndex++) {
              const parameter = message.params[paramIndex];
              const values: string[] = [];
              parameter.values.forEach(value => values.push(value));
              const commandInfo = {
                type,
                request,
                response,
                cmd,
                paramCount,
                paramIndex,
                param: parameter.name,
                autocomplete: values
              } as CommandInfo;
              this.commandsInfo.push(commandInfo);
            }
          }
        });
      });
    return ret;
  }

  /**
   * 空のモデルを取得する。
   *
   * @return 空のモデル
   */
  getEmptyModel(): Command {
    return {
      command: { id: '', cmd: '', params: [], nextid: [] },
      id: 0
    } as Command;
  }

  /**
   * バリデートする。
   *
   * @param edit エディットされたモデル
   * @return バリデートリザルト
   */
  validate(edit: Command): boolean {
    // check empty fields
    if (!edit.command.cmd) {
      this.showErrorMessage('Failed validation. The cmd field is required.');
      return false;
    }
    return true;
  }

  /**
   * コマンドインフォアレイを取得する。
   *
   * @return コマンドインフォアレイ
   */
  getCommandsInfo(): CommandInfo[] {
    return this.commandsInfo;
  }

  /**
   * ヒントを取得する。
   *
   * @param command コマンド
   * @param index インデックス
   * @return ヒント
   */
  getHint(cmd: string, index: number): string {
    const commandInfo = this.commandsInfo.find(
      element => element.cmd === cmd && element.paramIndex === index
    );
    if (commandInfo) {
      return commandInfo.param;
    }
    return '';
  }

  /**
   * オートコンプリートを取得する。
   *
   * @param cmd コマンド
   * @param index インデックス
   * @return オートコンプリート
   */
  getAutocomplete(cmd: string, index: number): string[] {
    const commandInfo = this.commandsInfo.find(
      element => element.cmd === cmd && element.paramIndex === index
    );
    if (commandInfo) {
      if (commandInfo.autocomplete.length === 0) {
        if (commandInfo.param === 'mapfile_name') {
          const autocomplete: string[] = [];
          return autocomplete;
        } else if (commandInfo.param === 'goal_name') {
          const autocomplete: string[] = [];
          this.poseService.getAll().forEach(element => {
            const found = autocomplete.find(item => item === element.name);
            if (!found) {
              autocomplete.push(element.name);
            }
          });
          return autocomplete;
        }
      }
      return commandInfo.autocomplete;
    }
    return [];
  }

  /**
   * コマンドを取得する。
   *
   * @return コマンドオプション
   */
  getCmds(): string[] {
    const cmds: string[] = [];
    this.commandsInfo
      .filter(element => element.paramIndex === 0)
      .forEach(cmd => cmds.push(cmd.cmd));
    return cmds;
  }
}

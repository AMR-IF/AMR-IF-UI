/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RobotService } from '../../robots/shared/robot.service';
import { PoseService } from '../../poses/shared/pose.service';
import { SettingService } from '../../settings/shared/setting.service';
import { CmdListService } from '../../cmd-lists/shared/cmd-list.service';
import { CommandService } from '../../commands/shared/command.service';
import { StorageService } from '../storage/storage-service';
import { StoreService } from '../store/store.service';

/**
 * コンフィグサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  /**
   * オブジェクトを構築する。
   *
   * @param storeService ストアサービス
   * @param settingService セッティングサービス
   * @param robotService ロボットサービス
   * @param poseService ポーズサービス
   * @param commandService コマンドサービス
   * @param cmdListService コマンドリストサービス
   * @param http HTTPクライアント
   */
  constructor(
    private storeService: StoreService,
    private settingService: SettingService,
    private robotService: RobotService,
    private poseService: PoseService,
    private commandService: CommandService,
    private cmdListService: CmdListService,
    private http: HttpClient
  ) {}

  /**
   * ロードする。
   *
   * @return プロミス
   */
  async load(): Promise<void> {
    // initialize
    await this.settingService.initialize();
    await this.commandService.initialize();
    const foundNull = await this.initialize();

    // demo data for first
    if (foundNull) {
      await this.setResetData();
    }

    await this.settingService.addSettings();
  }

  /**
   * イニシャライズする。
   *
   * @return プロミス
   */
  async initialize(): Promise<boolean> {
    const storageServices: StorageService<any>[] = [];

    // push
    storageServices.push(this.robotService);
    storageServices.push(this.poseService);
    storageServices.push(this.cmdListService);

    let foundNull = false;
    for (const element of storageServices) {
      const result = await element.initialize();
      if (!result) {
        foundNull = true;
      }
    }
    return foundNull;
  }

  /**
   * 全てリムーブする。
   *
   * @return プロミス
   */
  async removeAll(): Promise<void> {
    const keyValueStore = this.storeService.getKeyValueStore();
    await keyValueStore.remove(RobotService.STORAGE_KEY);
    await keyValueStore.remove(PoseService.STORAGE_KEY);
    await keyValueStore.remove(CmdListService.STORAGE_KEY);
    await keyValueStore.remove(SettingService.STORAGE_KEY);
    // clear
    localStorage.clear();
  }

  /**
   * リセットデータをセットする。
   *
   * @return プロミス
   */
  async setResetData(): Promise<void> {
    await this.removeAll();

    let response = await this.http
      .get('./assets/configs/reset/robots.json', {
        responseType: 'text'
      })
      .toPromise();
    this.robotService.restoreFromJSON(response);
    response = await this.http
      .get('./assets/configs/reset/poses.json', {
        responseType: 'text'
      })
      .toPromise();
    this.poseService.restoreFromJSON(response);
    response = await this.http
      .get('./assets/configs/reset/cmd-lists.json', {
        responseType: 'text'
      })
      .toPromise();
    this.cmdListService.restoreFromJSON(response);

    await this.storeAll();
  }

  /**
   * 全てストアする。
   *
   * @return プロミス
   */
  async storeAll(): Promise<void> {
    await this.robotService.store();
    await this.poseService.store();
    await this.cmdListService.store();
    await this.settingService.store();
  }
}

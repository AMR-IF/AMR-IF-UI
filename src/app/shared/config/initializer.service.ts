/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { environment } from 'src/environments/environment';

/**
 * イニシャライザーサービスです。
 */
@Injectable({
  providedIn: 'root'
})
export class InitializerService {
  /** インジェクター */
  static injector: Injector;

  /**
   * オブジェクトを構築する。
   *
   * @param http HTTPクライアント
   */
  constructor(private http: HttpClient) {}

  /**
   * イニシャライズする。
   *
   * 他のサービスのコンストラクタが呼ばれる前にconfig.jsonを読み込んで
   * environment.configに設定する。
   *
   * @return プロミス
   */
  async initialize(): Promise<void> {
    const response = await this.http
      .get('./assets/configs/config.json', {
        responseType: 'text'
      })
      .toPromise();
    const config = JSON.parse(response);
    // overwrite
    Object.assign(environment.config, config);

    // get configService from global injector
    const configService = InitializerService.injector.get(ConfigService);
    await configService.load();
  }
}

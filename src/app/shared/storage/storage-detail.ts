/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PickableModel } from '../pickable-model';
import { StorageService } from './storage-service';

/**
 * ストレージモデルデータの詳細を表示するコンポーネントの抽象基底クラスです。
 */
export abstract class StorageDetail<
  M extends PickableModel,
  S extends StorageService<M>
> implements OnInit {
  /** 編集中のモデル */
  edit: M;

  /** モデル */
  abstract model: M;

  /** サービス */
  abstract service: S;

  /** ルート */
  abstract route: ActivatedRoute;

  /** ロケーション */
  abstract location: Location;

  /**
   * オブジェクトを構築する。
   */
  constructor() {}

  /**
   * コンポーネントを初期化する。
   * ルートパラメータからモデルのアイディーを取得し、サービスからモデルを取得する。
   * 取得したモデルのデータを編集中のモデルにアサインする。
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      const model = this.service.getById(+id);
      if (model != null) {
        this.model = model;
        this.edit = this.deepCopy(this.model);
      } else {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }

  /**
   * JSONに変換してパースすることでディープコピーオブジェクトを取得する。
   *
   * @param model モデル
   */
  deepCopy(model: M): M {
    const json = JSON.stringify(model);
    return JSON.parse(json);
  }

  /**
   * 編集をキャンセルして元の場所に戻る。
   */
  cancel(): void {
    this.location.back();
  }

  /**
   * 編集結果をモデルに反映させてストレージにストアして元の場所に戻る。
   *
   * @return プロミス
   */
  async update(): Promise<void> {
    if (this.service.validate(this.edit)) {
      this.service.assign(this.model, this.edit);
      await this.service.store();
      this.location.back();
    }
  }

  /**
   * モデルを削除して削除できた場合は元のページに戻る。
   *
   * @return プロミス
   */
  async delete(): Promise<void> {
    const result = await this.service.remove(this.model);
    if (result) {
      this.location.back();
    }
  }
}

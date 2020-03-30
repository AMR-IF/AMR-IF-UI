/*
 * Copyright (C) 2020 TOSHIBA Corporation.
 * SPDX-License-Identifier: BSD-2-Clause
 */

import 'pixi.js';
import { Subscription, Subject, Observable } from 'rxjs';
import { BaseViewer } from '../base-viewer';
import { Marker } from './marker';

/**
 * ベースマーカーです。
 */
export class BaseMarker implements Marker {
  /** ビューワー */
  viewer: BaseViewer;

  /** ルートコンテナ */
  root: PIXI.Container;

  /** サブスクリプション */
  subscription: Subscription;

  /** ビジブル */
  visible = true;

  /** ビジブルサブジェクト */
  visibleSubject: Subject<boolean> = new Subject();

  /** ビジブルオブザーバブル */
  visibleObservable: Observable<boolean> = this.visibleSubject.asObservable();

  /**
   * オブジェクトを構築する。
   *
   * ビューワーに自身のマーカーを追加する。
   * ルートコンテナをビューワーのルートコンテナに追加する。
   * ビューワーの変化をサブスクリプトして変化した場合にupdateをコールする。
   *
   * コンテナの親子関係
   * Viewer.root -> BaseMarker.root
   *
   * @param viewer ビューワー
   */
  constructor(viewer: BaseViewer) {
    this.viewer = viewer;
    this.viewer.addMarker(this);
    this.root = new PIXI.Container();
    this.viewer.root.addChild(this.root);
    this.subscription = this.viewer.getObservableViwer().subscribe(() => {
      this.update();
    });
  }

  /**
   * ビューが変化した際にアップデートする。
   */
  update(): void {}

  /**
   * 表示する。
   *
   * ルートコンテナを表示する。
   */
  show(): void {
    this.visible = true;
    this.root.visible = true;
    this.visibleSubject.next(this.visible);
  }

  /**
   * 非表示にする。
   *
   * ルートコンテナを非表示にする。
   */
  hide(): void {
    this.visible = false;
    this.root.visible = false;
    this.visibleSubject.next(this.visible);
  }

  /**
   * 表示か非表示かを返却する。
   *
   * @return true(表示)/false(非表示)
   */
  isVisibled(): boolean {
    return this.visible;
  }

  /**
   * 表示か非表示かのオブザーバーを取得する。
   *
   * @return オブザーバー
   */
  getVisibleObservable(): Observable<boolean> {
    return this.visibleObservable;
  }

  /**
   * 破棄する。
   *
   * サブスクリプションをアンサブスクライブする。
   */
  dispose(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * 削除する。
   *
   * ビューワーから削除する。
   * ルートコンテナからルートコンテナを削除する。
   */
  remove(): void {
    this.dispose();
    this.viewer.removeMarker(this);
    this.viewer.root.removeChild(this.root);
  }

  /**
   * ビューワーをゲットする。
   */
  getViewer(): BaseViewer {
    return this.viewer;
  }
}

# AMR-IF-UI: インストール
<!-- TOC -->

- [1. インストール](#1-インストール)
    - [1.1. コード取得](#11-コード取得)
    - [1.2. 依存パッケージのインストール](#12-依存パッケージのインストール)
    - [1.3. アクセステスト](#13-アクセステスト)

<!-- /TOC -->

## 1. インストール

### 1.1. コード取得

本AMR-IFは、githubリポジトリからダウンロードするなどして適当なディレクトリに展開してください。

```shell
$ git clone https://github.com/robo-marc/AMR-IF-UI
$ cd AMR-IF-UI
$ ls
LICENSE         doc               package-lock.json  tsconfig.spec.json
LICENSE_HEADER  img               package.json       tslint.json
README.md       karma.conf.js     src
angular.json    ngsw-config.json  tsconfig.app.json
browserslist    node_modules      tsconfig.json
```

### 1.2. 依存パッケージのインストール

ここで、npm ci コマンドで依存パッケージをインストールします。

```shell
 $ sudo npm ci
    :
    > @angular/cli@9.1.0 postinstall /home/n-ando/work/AMR-IF-UI/node_modules/@angular/cli
> node ./bin/postinstall/script.js

added 1476 packages in 31.457s
$ sudo npm install -g @angular/cli
```

```shell
$ ng serve
   :
少し時間がかかります。
   :
Date: 2021-09-23T08:04:01.730Z - Hash: 98b0164d374b20b98c5c
5 unchanged chunks

Time: 542ms
: Compiled successfully.
```

このとき、以下のように、GoogleのAngularチームと使用状況データを共有するか、以下のように確認のメッセージが表示されますので、特に問題がなければ "y" を入力して先に進みます。（そういうのを好まない場合は "n" でも結構です。）

```shell
? Would you like to share anonymous usage data with the Angular Team at Google u
 nder Google’s Privacy Policy at https://policies.google.com/privacy? 
 For more details and how to change this setting, see http://angular.io/analytics.
```

"ng serve" コマンド実行後は、コマンドプロンプトは帰ってきませんが、これは裏でHTTPサービスが動作しているためです。次のアクセステストに進み、Webサービスにアクセスできるかテストします。

### 1.3. アクセステスト

ブラウザから、http://localhost:4200 にアクセスしてみてください。

- [http://localhost:4200](http://localhost:4200)

以下のような画面が表示されるはずです。

<img src="figs/amr-if-ui_00.png">

ポートは以下のように "--port" オプションで変更可能です。

```shell
$ ng server --port 8080
```
1023番以下のポートにする場合は root 権限が必要ですので、コマンドの前に sudo などが必要です。

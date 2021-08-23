# AMR-IF

本パッケージは、NEDOロボット活用型市場化適用技術開発プロジェクト(2017-2020)で開発された、移動ロボット (Autonomout Mobile Robot: AMR) 用のWeb GUIインターフェースです。



## インストール

### 環境
本パッケージを動作させるには以下の環境が必要です。

- OS: AMR-IFサーバ (node.js) を動作可能であれば何でも良い
  - Linux, Windows あるいは macOS 等
  - 本ドキュメントでは Linux 上で動作させる方法を説明します
- node.js バージョン XX以上
- httpサーバ (Apache等)
- Google Chrome
  - Google Chromeで動作する JavaScriptのバージョンが重要
- Angular
  - npmなどでインストール

### node.js のインストール

```shell
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install nodejs npm
$ 
```

#### Ubuntu 18.04/ros melodic の場合

rosがインストールされている状態から npm をインストールしようとすると、
libssl1.0-dev の依存関係が解決されずインストールできない。強制的に
libssl1.0-dev をインストールすると ros関係のパッケージが大量に削除される
ので注意。

以下の手順で、一旦libssl1.0-dev/npmパッケージをインストールした上で、npm
を最新に更新し、その後rosパッケージを再インストールする、という方法を取
ります。

```shell
# aptのログを退避
$ sudo mv /var/log/apt/history.log /var/log/apt/history.log.org
$ sudo touch /var/log/apt/history.log
# npmのインストール
$ sudo apt install libssl1.0-dev npm nodejs
$ node -v
v8.10.0
$ npm -v
v3.5.2
# aptのログをコピーして保管 & もとに戻す
$ cp /var/log/apt/history.log .
$ sudo mv /var/log/apt/history.log.org /var/log/apt/history.log
$ sudo cat history.log >> /var/log/apt/history.log
```

更に、npm で n package を使って node をインストールする。

'''shell
$ sudo npm install n -g
/usr/local/bin/n -> /usr/local/lib/node_modules/n/bin/n
/usr/local/lib
└── n@7.4.1 

$ sudo n stable
  installing : node-v14.17.6
       mkdir : /usr/local/n/versions/node/14.17.6
       fetch : https://nodejs.org/dist/v14.17.6/node-v14.17.6-linux-x64.tar.xz
   installed : v14.17.6 (with npm 6.14.15)

Note: the node command changed location and the old location may be remembered in your current shell.
         old : /usr/bin/node
         new : /usr/local/bin/node
To reset the command location hash either start a new shell, or execute PATH="$PATH"

# n packageでは /usr/local/n の下に任意のバージョンのnodejsをインストールし管理
# /usr/local/bin の下にシンボリックリンクを張って使用する。
# したがって、/usr/local/bin の下にパスを通す必要がある。
```

aptで入れた nodejs/npm はもう不要なので削除します。パッケージ削除後にパスを更新しないと正常にアクセスできないようなので .bashrc を読み直しています。

```shell
$ sudo apt purge nodejs npm
$ source ~/.bashrc
$ node -v
v14.17.6
$ npm -v
6.14.15
$ which node
/usr/local/bin/node
$ which npm
/usr/local/bin/npm
```

#### Home Brew (macOS)

```shell
$ brew update
$ brew install nodejs npm
$ npm install angular
```
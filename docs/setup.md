# AMR-IF-UI: 環境構築

<!-- TOC -->

- [1. 環境構築](#1-環境構築)
    - [1.1. 環境](#11-環境)
    - [1.2. Google Chromeの インストール](#12-google-chromeの-インストール)
    - [1.3. node.js のインストール](#13-nodejs-のインストール)
        - [1.3.1. Ubuntu 18.04/ros melodic の場合](#131-ubuntu-1804ros-melodic-の場合)
        - [1.3.2. Home Brew (macOS)](#132-home-brew-macos)

<!-- /TOC -->

## 1. 環境構築

### 1.1. 環境
本パッケージを動作させるには以下の環境が必要です。

- node.js 12.16.1 で動作確認済み
- OS: AMR-IFサーバ (node.js) を動作可能であれば何でも良い
  - Linux, Windows あるいは macOS 等
  - 本ドキュメントでは Linux 上で動作させる方法を説明します
- httpサーバ (Apache等)
- Google Chrome
  - Google Chromeで動作する JavaScriptのバージョンが重要
- Angular
  - npmなどでインストール

### 1.2. Google Chromeの インストール

Ubuntu Linux への Google Chrome も他のOS同様、
ブラウザ（Ubuntuにデフォルトでインストールされている FireFox等を利用) 
で "chrome" と検索し、画面の指示に従いインストールするのが近道です。

Ubuntuの場合、debパッケージ版のchromeがダウンロードされ、
パッケージマネージャでインストールするところまでほぼ自動で行われます。

インストール後は、左下の "アプリケーションを表示する" から 
Google Chromeを選択して起動するか、

```shell
$ /opt/google/chrome/chrome &
```
として起動することもできます。


### 1.3. node.js のインストール

```shell
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install nodejs npm
```

更に、npm で n package をインストールし、n package を使って新しい node をインストールします。


```shell
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

aptで入れた nodejs/npm は古く、もう不要なので削除します。パッケージ削除
後にパスを更新しないと正常にアクセスできないようなので .bashrc を読み直
しています。

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

さらに、angular CLI をインストールします。

```shell
$ npm install -g @angular/cli
```

#### 1.3.1. Ubuntu 18.04/ros melodic の場合

rosがインストールされている状態から npm をインストールしようとすると、
libssl1.0-dev の依存関係が解決されずインストールできません。
強制的に libssl1.0-dev をインストールすると
ros関係のパッケージが大量に削除されるので注意が必要です。

##### libsslのインストールとログ保存

以下の手順で、一旦libssl1.0-dev/npmパッケージをインストールした上で、
npm を最新に更新し、その後rosパッケージを再インストールする、
という方法を取ります。

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

##### n pakcageのインストール

更に、上記同様、npm で n package を使って node をインストールします。

```shell
$ sudo npm install n -g
$ sudo n stable
```

##### deb package の nodejs/npm の削除
apt で入れた nodejs/npm はもう不要なので削除します。
パッケージ削除後にパスを更新しないと正常にアクセスできないようなので
 .bashrc を読み直しています。
 また、同様に angular CLI をインストールします。

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

# angular CLIをインストール
$ npm install -g @angular/cli
```

##### rosのパッケージを戻す

libssl1.0-devをインストールするときに ROS のパッケージ群が削除されましたので、
最初に保存した history.log から削除されたパッケージを再インストールします。

```shell
$ ls history.log
$ cat history.log

Start-Date: 2021-09-23  16:05:34
Commandline: apt install libssl1.0-dev npm
Requested-By: n-ando (1000)
 :
中略
Remove: ros-melodic-image-proc:amd64 (1.15.0-1bionic.20210505.035446), ros-melod
```

history.log の Remove: から始まる行に削除されたパッケージ名がリストアップされています。
このエントリーは

```
<package_name>:<arch> (<version string>), ...
```
というフォーマットになっていますので、以下のようにして、
パッケージ名だけ取り出して再度インストールし直します。

```shell
$ grep Remove history.log | awk 'BEGIN{RS=",";}!/Remove/{sub("\:.*",""); print $1;}' |xargs sudo apt install --yes
```

#### 1.3.2. Home Brew (macOS)

macOS では Home Brew を利用すると容易に環境を構築することができます。

- [Home Brew](https://brew.sh/index_ja)

```shell
$ brew update
$ brew install nodejs npm
$ npm install -g @angular/cli
```


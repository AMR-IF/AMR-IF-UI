# AMR-IF-UI: デプロイ

<!-- TOC -->

- [1. デプロイメント](#1-デプロイメント)
    - [1.1. ビルド](#11-ビルド)
    - [1.2. ベースURLの変更](#12-ベースurlの変更)

<!-- /TOC -->

## 1. デプロイメント

AMR-IF-UI は、Angularフレームワークで構築されており、
AOT (Ahead-of-time) コンパイラで事前にトランスパイル (ビルドする) することで、
ブラウザでのロード速度を向上させることができる事ができ、
nodejs/npm 等がインストールされていないWebサーバ上へデプロイ（配置）することができます。
(ただし、AMR-IF-UI自体は ROS/Robot Web Tools に依存していますので、
必要なパッケージは別途インストールする必要があります。)

### 1.1. ビルド

AMR-IF-UI のプロジェクトルートディレクトリで ng build コマンドを入力します。

```shell
$ ls
LICENSE			README.md		browserslist		img			
ngsw-config.json	package-lock.json	src			tsconfig.json
tslint.json LICENSE_HEADER		angular.json		karma.conf.js
package.json		tsconfig.app.json	tsconfig.spec.json
$ ng build
Compiling @angular/cdk/keycodes : es2015 as esm2015
Compiling @angular/animations : es2015 as esm2015
  : 
  中略
  :
chunk {vendor} vendor-es5.js, vendor-es5.js.map (vendor) 7.42 MB [initial] [rendered]
Date: 2021-09-23T14:35:03.634Z - Hash: 36137cafdae0110f8877 - Time: 101231ms

```

dist/AMR-IF-UI というディレクトリが作成されており、
その中にデプロイ可能なパッケージが生成されています。

```shell
$ cd dist/AMR-IF-UI/
$ ls
assets			main-es2015.js		main-es5.js		manifest.webmanifest
 : 
styles-es2015.js	styles-es5.js		vendor-es2015.js	vendor-es5.js
$
```

このディレクトリ内のファイルをHTTPサーバの公開可能なディレクトリへコピーすることで、
このプロジェクトを公開可能です。

仮に、いま "/var/www/data" が空であり、 apache の Document Root であると仮定すると
```shell
$ sudo cp * /var/www/data/
```

apacheが動作していれば、http://localhost にアクセスすると以下の画面が表示されます。

- [http://localhost](http://localhost)

<img src="figs/amr-if-ui_00.png">

### 1.2. ベースURLの変更

Webサーバのドキュメントルートで公開するのではなく、
場合によっては特定の階層下のURLで公開したいことがあります。

その場合は、build するときに、--base-href= オプションを使用して
公開する階層のパスを指定します。

```shell
$ cd <project root>
$ ng build --base-href=/AMR-IF-UI/
$ cd dist
$ sudo cp -r AMR-IF-UI /var/www/data/
```

こうすると、AMR-IF-UI を http://localhost/AMR-IF-UI/ でアクセスすることができます。

- [http://localhost/AMR-IF-UI/](http://localhost/AMR-IF-UI/)


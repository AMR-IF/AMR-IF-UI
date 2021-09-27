# AMR-IF-UI: Installation
<!-- TOC -->

- [1. Installation](#1-installation)
    - [1.1. Downloading source code](#11-downloading-source-code)
    - [1.2. Installation of dependent packages](#12-installation-of-dependent-packages)
    - [1.3. Access test](#13-access-test)

<!-- /TOC -->

## 1. Installation

### 1.1. Downloading source code

Please download this AMR-IF from the github repository and extract it to an appropriate directory.

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

### 1.2. Installation of dependent packages

Now install the dependent packages with the npm ci command.

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
It will take some time.
   :
Date: 2021-09-23T08:04:01.730Z - Hash: 98b0164d374b20b98c5c
5 unchanged chunks

Time: 542ms
: Compiled successfully.
```

At this time, as shown below, a confirmation message will be displayed
asking if you want to share usage data with Google's Angular team, so if
there is no problem, enter "y" and proceed. (If you don't like that, you
can use "n".)

```shell
 ? Would you like to share anonymous usage data with the Angular Team at 
 Google under Google’s Privacy Policy at https://policies.google.com/privacy?
 For more details and how to change this setting, see http://angular.io/analytics.
```

After executing the "ng serve" command, the command prompt does not come
back, because the HTTP service is running behind the process. Proceed to
the next access test to test if you can access the web service.

### 1.3. Access test

Try accessing http://localhost:4200 from your browser.


- [http://localhost:4200](http://localhost:4200)

The following page would be displayed.

<img src="figs/amr-if-ui_00.png">

The port-number can be changed with "--port" option.

```shell
$ ng server --port 8080
```

If you use under 1023 port, since root privilege is required, use sudo before the command.

# AMR-IF-UI: Setting Up Environment

<!-- TOC -->

- [1. Setting Up](#1-setting-up)
    - [1.1. Requirements](#11-requirements)
    - [1.2. Installing Google Chrome](#12-installing-google-chrome)
    - [1.3. Installing Node.js](#13-installing-nodejs)
        - [1.3.1. In case of Ubuntu 18.04/ros melodic](#131-in-case-of-ubuntu-1804ros-melodic)
        - [1.3.2. Home Brew (macOS)](#132-home-brew-macos)

<!-- /TOC -->

## 1. Setting Up

### 1.1. Requirements

The following packages and OS are required to run this package.

- node.js 12.16.1 (confirmed under this version)
- OS: Any kind of OS is OK if AMR-IF server (node.js) is runnable
  - Linux, Windows or macOS
  - This document assumes Ubuntu Linux
- http server (Apache, etc.)
- Google Chrome
  - JavaScript environment of Google Chrome is required
- Angular
  - is installed by npm
  
### 1.2. Installing Google Chrome

As with other operating systems, Google Chrome for Ubuntu Linux is a
shortcut to search for "chrome" in your browser (using Firefox, which is
installed by default on Ubuntu), and follow the on-screen instructions
to install it.

In the case of Ubuntu, the deb package version of chrome is downloaded,
and installation with the package manager is almost automatic.

After installation, select Google Chrome from "Show applications" at the
bottom left to start it.

Google Chrome can be launched also by the following.

```shell
$ /opt/google/chrome/chrome &
```

### 1.3. Installing Node.js

Please install nodejs and npm as follows.

```shell
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install nodejs npm
```

In addition, install n-package with npm and use n-package to install a new node.

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

# n package installs and manages various versions of nodejs under 
# /usr/local/n, and these symbolic linked in /usrlocal/bin commands
# are used. The PATH have to include /usr/local/bin as command search path
```
The nodejs/npm that are installed by apt are old and no longer needed.
So please delete them. Here, .bashrc is sourced (re-loaded) because PATH
have to be refreshed after deleing packages.

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

In addition, algular CLI is installed.

```shell
$ npm install -g @angular/cli
```

#### 1.3.1. In case of Ubuntu 18.04/ros melodic

If you try to install npm into a environment installed ROS, the
libssl1.0-dev dependency will not be resolved and you will not be able
to install it. Please note that forcibly installing libssl1.0-dev will
remove a large number of ROS related packages.


##### Installing libssl and saving a log

Please follow the steps below to install the libssl1.0-dev/npm package.
After that update npm to the latest version by n-package, and then
reinstall ROS packages.


```shell
# Saving apt log
$ sudo mv /var/log/apt/history.log /var/log/apt/history.log.org
$ sudo touch /var/log/apt/history.log

# Installing npm
$ sudo apt install libssl1.0-dev npm nodejs
$ node -v
v8.10.0
$ npm -v
v3.5.2

# Coping apt history log and merge them
$ cp /var/log/apt/history.log .
$ sudo mv /var/log/apt/history.log.org /var/log/apt/history.log
$ sudo cat history.log >> /var/log/apt/history.log
```

##### Installing n pakcage

In addition, as above, install node with npm using n package.

```shell
$ sudo npm install n -g
$ sudo n stable
```

##### Deleting deb packaged nodejs/npm

The nodejs/npm that are installed by apt are old and no longer needed.
So please delete them. Here, .bashrc is sourced (re-loaded) because PATH
have to be refreshed after deleing packages.

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

# Installing angular CLI
$ npm install -g @angular/cli
```

##### Recovering ros packages

The ROS packages were removed when you installed libssl1.0-dev, so
reinstall the removed packages from the history.log you saved first.

```shell
$ ls history.log
$ cat history.log

Start-Date: 2021-09-23  16:05:34
Commandline: apt install libssl1.0-dev npm
Requested-By: n-ando (1000)
 :
 :
Remove: ros-melodic-image-proc:amd64 (1.15.0-1bionic.20210505.035446), ros-melod
```

The lines starting with "Remove:" in history.log list the removed
package names. These entries have the following format.

```
<package_name>:<arch> (<version string>), ...
```

Please re-install packages extracting the package name from the log as follows.

```shell
$ grep Remove history.log | awk 'BEGIN{RS=",";}!/Remove/{sub("\:.*",""); print $1;}' |xargs sudo apt install --yes
```

#### 1.3.2. Home Brew (macOS)

In macOS, you can easily build an environment by using Home Brew.

- [Home Brew](https://brew.sh/index_ja)

```shell
$ brew update
$ brew install nodejs npm
$ npm install -g @angular/cli
```


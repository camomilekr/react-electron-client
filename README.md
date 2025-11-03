# react electron client
electron 을 사용한 client template

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Windows

[Visual Studio Build Tool 2022](https://aka.ms/vs/17/release/vs_BuildTools.exe)
- 'C++를 사용한 데스크톱 개발' 워크로드를 선택하여 설치

Python 3.9.10 [(win32)](https://www.phyton.org/ftp/phyton/3.9.10/phyton-3.9.10-amd64.exe)
- 3.10 버전 미만 반드시 사용 필수
- 3.10 이상 버전 사용중인 경우 기존 버전 삭제 후 3.9.10 설치 필요

[node-gyp]
serialport 등 native c++ 코드 빌드를 위해 필요
```bash
$ npm install -g node-gyp
```

### macOS

[Xcode Command Line Tools]
```bash
$ xcode-select --install
```
또는 App Store 에서 Xcode full install

Python 3.9.10 [(macOS)](https://www.python.org/ftp/python/3.9.10/python-3.9.10-macos11.pkg)
- 3.10 버전 미만 반드시 사용 필수
- 3.10 이상 버전 사용중인 경우 기존 버전 삭제 후 3.9.10 설치 필요

[node-gyp]
serialport 등 native c++ 코드 빌드를 위해 필요
```bash
$ npm install -g node-gyp
```

### Install

```bash
$ yarn install
```

### Development

```bash
$ yarn build:addon && yarn start:dev
```

### Build

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```

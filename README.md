mfcloud-attendance
==================

コマンドラインからMFクラウドにログインして、出勤・退勤を行うCLIアプリケーションである。


# Dependency

* node.js >= 8.0.0


# Installation

```bash
$ git clone https://github.com/cami/mfcloud-attendance.git
$ cd mfcloud-attendance
$ npm install
```


# Usage

## 出勤

```bash
./bin/run --company "your company" --email "your email" --password "your password" --arrive
```


## 退勤

```bash
./bin/run --company "your company" --email "your email" --password "your password" --leave
```


## ヘルプ

```bash
./bin/run -h
```

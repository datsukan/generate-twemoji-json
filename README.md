# Generate twemoji json

[Twemoji Preview](https://github.com/datsukan/twemoji-preview)のサイトで使用するTwemojiに関する情報のリストをJSON形式で生成するツールです。

## Installation \ 導入

```sh
git clone https://github.com/datsukan/generate-twemoji-json.git
cd generate-twemoji-json
yarn install
```

## Usage \ 使用方法

```sh
node scrips/generate.js
```

`json/twemoji.json`が生成される。

## Note \ 注意事項

外部サイトから動的に取得して生成しているため、外部サイト起因で正常に取得できなくなる可能性あります。

## Author \ 著者

datsukan

## License \ ライセンス

[MIT License](https://en.wikipedia.org/wiki/MIT_License)

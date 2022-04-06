const axios = require("axios")
const cheerio = require("cheerio")
const emojis = require("emoji.json")
const nodeEmoji = require("node-emoji")
const twemoji = require("twemoji")
const fs = require("fs").promises

const saveDir = `${__dirname}/../json/`

main()

async function main() {
  try {
    const html = await fetch()
    const twemojiInfos = await convert(html)
    await save(twemojiInfos)
  } catch (error) {
    console.error(error)
    console.log("異常終了しました。")
  }
}

async function fetch() {
  const res = await axios.get("https://twemoji.maxcdn.com/2/test/preview.html")
  return res.data
}

async function convert(html) {
  const $ = cheerio.load(html)
  let twemojiInfos = []

  $("ul.emoji-list > li").map(async (_, el) => {
    const char = $(el).text()
    const twemojiInfo = (await getInfo(char)) ?? { char: char }
    twemojiInfo.url = twemojiURL(char)
    if (nodeEmoji.hasEmoji(char)) twemojiInfo.key = nodeEmoji.unemojify(char)

    twemojiInfos.push(twemojiInfo)
  })

  return twemojiInfos
}

async function save(twemojiInfos) {
  await resetDir()

  await fs.writeFile(
    `${saveDir}twemoji.json`,
    JSON.stringify(twemojiInfos, null, "\t")
  )
  console.log(`${twemojiInfos.length} 件`)
  console.info("保存完了")
}

async function getInfo(char) {
  return await emojis.find(item => item.char === char)
}

// 記事を格納するディレクトリの状態を初期化する
async function resetDir() {
  if (await dirExists()) {
    // ディレクトリが存在する場合は中のファイルを削除する
    await fileDelete()
    console.log("既存のファイルを削除しました。")
  } else {
    // ディレクトリが存在しない場合は作成する
    await fs.mkdir(saveDir, { recursive: true })
    console.log("ディレクトリを作成しました。")
  }
}

// 記事を格納するディレクトリ内のファイルを削除する
async function fileDelete() {
  const files = await fs.readdir(saveDir)
  const promises = files.map(async file => {
    await fs.unlink(`${saveDir}/${file}`)
    console.log(`削除： ${file}`)
  })
  await Promise.all(promises)
}

// 記事を格納するディレクトリが存在していることを判定する
async function dirExists() {
  try {
    return (await fs.lstat(saveDir)).isDirectory()
  } catch (e) {
    return false
  }
}

function twemojiURL(char) {
  const html = twemoji.parse(char, { folder: "svg", ext: ".svg" })
  const $ = cheerio.load(html)
  const url = $("img").attr("src")

  return url
}

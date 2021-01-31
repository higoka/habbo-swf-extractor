#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const SWFReader = require('@gizeta/swf-reader')
const fs = require('fs')
const Jimp = require('jimp')
const zlib = require('zlib')
const path = require('path')

async function dumpAsset (assetName, inputDir, outputDir) {
  await fs.promises.mkdir(`${outputDir}/${assetName}`, { recursive: true })

  const swf = SWFReader.readSync(
    await fs.promises.readFile(`${inputDir}/${assetName}.swf`)
  )

  // symbol class
  const map = swf.tags.find((tag) => tag.header.code === 76).symbols.map((symbol) => {
    symbol.name = symbol.name.substr(assetName.length + 1)
    return symbol
  })

  for (const tag of swf.tags) {
    // binary
    if (tag.header.code === 87) {
      const symbol = map.find((symbol) => symbol.id === tag.data.readUInt16LE())

      if (!symbol) continue

      await fs.promises.writeFile(`${outputDir}/${assetName}/${symbol.name}.xml`, tag.data.slice(6))
    }

    // image
    if (tag.header.code === 36) {
      const symbol = map.find((symbol) => symbol.id === tag.characterId)

      if (!symbol) continue

      const image = new Jimp(tag.bitmapWidth, tag.bitmapHeight)
      const bitmap = zlib.unzipSync(Buffer.from(tag.zlibBitmapData, 'hex'))

      let pos = 0

      for (let y = 0; y < tag.bitmapHeight; y++) {
        for (let x = 0; x < tag.bitmapWidth; x++) {
          const a = bitmap.readUInt8(pos++)
          const r = bitmap.readUInt8(pos++)
          const g = bitmap.readUInt8(pos++)
          const b = bitmap.readUInt8(pos++)

          image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y)
        }
      }

      await image.writeAsync(`${outputDir}/${assetName}/${symbol.name}.png`)
    }
  }
}

async function main () {
  if (!argv.in || !argv.out) {
    console.error('error: missing option "--in" or "--out"')
    return
  }

  const inputDir = path.resolve(argv.in)
  const outputDir = path.resolve(argv.out)

  for (const fileName of await fs.promises.readdir(inputDir)) {
    if (!fileName.endsWith('.swf')) {
      continue
    }

    const assetName = fileName.substr(0, fileName.length - 4)

    await dumpAsset(assetName, inputDir, outputDir)

    console.log(`extracted: ${fileName}`)
  }
}

main()

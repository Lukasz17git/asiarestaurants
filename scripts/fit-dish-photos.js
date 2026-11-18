// Saves in photo-fits.json how much to enlarge and move each dish photo so its plate fills the card (fit-photo.js).
// Runs before every start and build, but only measures photos whose hash changed
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { fitPhoto, defaultOptions } = require('./fit-photo')

const root = path.join(__dirname, '..')
const photosFolder = path.join(root, 'public/dishes/photos-compressed')
const fitsFile = path.join(root, 'public/dishes/photo-fits.json')

// Rolls shot on a mirror have a copy below them with less contrast: that half weighs 0.5
const options = { ...defaultOptions, reflectionContrast: 0.8 }
// Part of every hash, with fitPhoto's code, so changing either measures all the photos again
const settings = JSON.stringify(options) + fs.readFileSync(require.resolve('./fit-photo'), 'utf8')

const round = (value, decimals) => Number(value.toFixed(decimals))

const getPhotoPath = (photo) => path.join(photosFolder, `${photo}.webp`)

const getHash = (photo) => crypto.createHash('md5').update(fs.readFileSync(getPhotoPath(photo))).update(settings).digest('hex')

// The photo's fit, plus its height / width when it isn't square (the card's --photo-ratio)
const measurePhoto = async (sharp, photo) => {
    const { data, info: { width, height } } = await sharp(getPhotoPath(photo)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const fit = fitPhoto({ data, width, height }, options)
    return width === height ? fit : { ...fit, ratio: round(height / width, 3) }
}

const fitChangedPhotos = async () => {
    const savedFits = fs.existsSync(fitsFile) ? JSON.parse(fs.readFileSync(fitsFile, 'utf8')) : {}
    const photos = fs.readdirSync(photosFolder).filter((file) => file.endsWith('.webp')).map((file) => file.slice(0, -'.webp'.length)).sort()
    const hashes = Object.fromEntries(photos.map((photo) => [photo, getHash(photo)]))
    const changedPhotos = photos.filter((photo) => savedFits[photo]?.hash !== hashes[photo])
    const hasRemovedPhotos = Object.keys(savedFits).some((photo) => !hashes[photo])
    if (!changedPhotos.length && !hasRemovedPhotos) return

    // Loaded only when there is something to measure
    const sharp = require('sharp')
    const fits = {}
    for (const photo of photos) {
        fits[photo] = changedPhotos.includes(photo) ? { hash: hashes[photo], ...(await measurePhoto(sharp, photo)) } : savedFits[photo]
    }
    fs.writeFileSync(fitsFile, `${JSON.stringify(fits, null, 2)}\n`)
    console.log(`photo-fits.json: ${changedPhotos.length} photos measured`)
}

fitChangedPhotos()

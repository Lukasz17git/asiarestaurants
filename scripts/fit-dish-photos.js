// Saves in photo-fits.json how much to enlarge and move each dish photo so its plate fills the card.
// Runs before every start and build, but only measures photos whose hash changed
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const photosFolder = path.join(root, 'public/dishes/photos-compressed')
const fitsFile = path.join(root, 'public/dishes/photo-fits.json')

// The card's photo box is 1.2 times wider than tall and shows the square photo with object-fit: cover
const boxRatio = 1.2
// Enlarges until only 5 % of the plate falls outside the box's central 80 %
const centralArea = 0.8
const plateInside = 0.95
// Uramakis and gunkans (2 small pieces) would reach ×2.3 and look bigger than a full plate
const maxScale = 1.6
// Photos without transparency have a #1b1b1b background: max(R, G, B) 40 counts as background, 60 as plate
const backgroundLevel = 40
const backgroundFade = 20
// Rolls shot on a mirror (only opaque photos) have a darker copy below: a plate whose lower half is at most
// 82 % as bright as its upper half. That half weighs 0.5, or the roll sits too high and ~5 % too big
const reflectionBrightness = 0.82
const reflectionWeight = 0.5
// Part of every hash, so changing a setting measures all the photos again
const settings = JSON.stringify({ boxRatio, centralArea, plateInside, maxScale, backgroundLevel, backgroundFade, reflectionBrightness, reflectionWeight })

const round = (value, decimals) => Number(value.toFixed(decimals))

const getPhotoPath = (photo) => path.join(photosFolder, `${photo}.webp`)

const getHash = (photo) => crypto.createHash('md5').update(fs.readFileSync(getPhotoPath(photo))).update(settings).digest('hex')

// How much each pixel is plate (0 to 1): its alpha, or how much brighter it is than the dark background;
// halved in a reflection
const getPlateWeights = async (sharp, photo) => {
    const image = sharp(getPhotoPath(photo))
    const { hasAlpha } = await image.metadata()
    const { data, info: { width, height } } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const weights = new Float32Array(width * height)
    const brightness = new Uint8Array(width * height)
    for (let pixel = 0; pixel < weights.length; pixel++) {
        const [red, green, blue, alpha] = [data[pixel * 4], data[pixel * 4 + 1], data[pixel * 4 + 2], data[pixel * 4 + 3]]
        brightness[pixel] = Math.max(red, green, blue)
        weights[pixel] = hasAlpha ? alpha / 255 : Math.min(1, Math.max(0, (brightness[pixel] - backgroundLevel) / backgroundFade))
    }
    const reflectionRow = hasAlpha ? null : getReflectionRow({ weights, brightness, width, height })
    if (reflectionRow !== null) for (let pixel = reflectionRow * width; pixel < weights.length; pixel++) weights[pixel] *= reflectionWeight
    return { weights, width, height, hasAlpha }
}

// The row where the plate's reflection starts (the middle of the plate's rows), or null without one
const getReflectionRow = ({ weights, brightness, width, height }) => {
    const rows = Array.from({ length: height }, (_, row) => {
        let [weight, light] = [0, 0]
        for (let pixel = row * width; pixel < (row + 1) * width; pixel++) {
            weight += weights[pixel]
            light += weights[pixel] * brightness[pixel]
        }
        return { weight, light }
    })
    // Rows with plate in at least 2 % of the width, so stray crumbs don't count
    const plateRows = rows.flatMap((row, index) => (row.weight > width * 0.02 ? [index] : []))
    const middleRow = Math.round((plateRows[0] + plateRows[plateRows.length - 1]) / 2)
    const getBrightness = (part) => part.reduce((sum, row) => sum + row.light, 0) / part.reduce((sum, row) => sum + row.weight, 0)
    const lowerBrightness = getBrightness(rows.slice(middleRow, plateRows[plateRows.length - 1] + 1))
    const upperBrightness = getBrightness(rows.slice(plateRows[0], middleRow))
    return lowerBrightness <= upperBrightness * reflectionBrightness ? middleRow : null
}

// The plate's pixels as distances from its center of mass, in fractions of the photo's width and height
const getPlatePixels = ({ weights, width, height }) => {
    const pixels = []
    let [totalWeight, sumX, sumY] = [0, 0, 0]
    weights.forEach((weight, pixel) => {
        if (!weight) return
        const [x, y] = [(pixel % width) / width, Math.floor(pixel / width) / height]
        pixels.push({ x, y, weight })
        totalWeight += weight
        sumX += weight * x
        sumY += weight * y
    })
    const [centerX, centerY] = [sumX / totalWeight, sumY / totalWeight]
    const distances = pixels.map(({ x, y, weight }) => ({ distanceX: Math.abs(x - centerX), distanceY: Math.abs(y - centerY), weight }))
    return { distances, totalWeight, centerX, centerY }
}

// Share of the plate inside the box's central area once the photo is enlarged by scale
const getShareInside = ({ distances, totalWeight }, scale) => {
    const [halfWidth, halfHeight] = [centralArea / 2 / scale, centralArea / 2 / boxRatio / scale]
    const weightInside = distances.reduce((sum, { distanceX, distanceY, weight }) => (distanceX <= halfWidth && distanceY <= halfHeight ? sum + weight : sum), 0)
    return weightInside / totalWeight
}

// Enlarges from 1 to maxScale (never shrinks), then moves the plate's center to the middle:
// x in % of the box's width and y in % of its height, as CSS translate reads them
const getFit = (plateWeights) => {
    const platePixels = getPlatePixels(plateWeights)
    // The share inside only goes down as the scale grows, so halving the range 12 times finds it to 0.001
    let [lowScale, highScale] = [1, maxScale]
    for (let step = 0; step < 12; step++) {
        const middleScale = (lowScale + highScale) / 2
        if (getShareInside(platePixels, middleScale) >= plateInside) lowScale = middleScale
        else highScale = middleScale
    }
    const scale = lowScale
    let x = -scale * (platePixels.centerX - 0.5) * 100
    let y = -scale * (platePixels.centerY - 0.5) * boxRatio * 100
    // An opaque photo can't move further than it overflows the box, or its background square would show an edge
    if (!plateWeights.hasAlpha) {
        const [maxX, maxY] = [((scale - 1) / 2) * 100, ((scale * boxRatio - 1) / 2) * 100]
        x = Math.max(-maxX, Math.min(maxX, x))
        y = Math.max(-maxY, Math.min(maxY, y))
    }
    return { scale: round(scale, 2), x: round(x, 1), y: round(y, 1) }
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
        fits[photo] = changedPhotos.includes(photo) ? { hash: hashes[photo], ...getFit(await getPlateWeights(sharp, photo)) } : savedFits[photo]
    }
    fs.writeFileSync(fitsFile, `${JSON.stringify(fits, null, 2)}\n`)
    console.log(`photo-fits.json: ${changedPhotos.length} photos measured`)
}

fitChangedPhotos()

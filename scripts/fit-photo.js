// How much to enlarge and move a photo so its subject fills a box, whatever its background: transparent, or a
// flat colour (black, white, grey) read from the photo's edge. The fit is for an img as wide as the box, centred in
// it at its own aspect ratio, moved with CSS `translate` (x and y in % of the img) and `scale`

const defaultOptions = {
    // The box's width / height
    boxRatio: 1.2,
    // The subject's size and centre leave out 2.5 % of its weight on each side: stray pixels, crumbs, a sauce drop
    trim: 0.025,
    // What's left fills the box's central 80 %
    centralArea: 0.8,
    // 1: never shrinks; 1.6: a small subject doesn't look bigger than a full one
    minScale: 1,
    maxScale: 1.6,
    // A pixel 15 levels from the background colour, in its most different channel, starts counting as subject;
    // 35 counts fully
    backgroundDistance: 15,
    backgroundFade: 20,
    // A photo with less than 30 % of its edge near one colour fills the frame (shot from above): kept as it is
    backgroundEdgeShare: 0.3,
    // For subjects shot on a mirror, which have a copy below them with less contrast: with 0.8, a lower half at most
    // 80 % as far from the background as the upper half weighs 0.5, or the subject sits too high and too big.
    // 0: off, as a plate's shadow on white gives the same 0.67 to 0.8
    reflectionContrast: 0,
    reflectionWeight: 0.5,
}

const fitOriginal = { scale: 1, x: 0, y: 0 }

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

// The pixels of the photo's outer 2-pixel ring
const getEdgePixels = (width, height) => {
    const pixels = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x < 2 || y < 2 || x >= width - 2 || y >= height - 2) pixels.push(y * width + x)
        }
    }
    return pixels
}

// How far a pixel is from a colour, in its most different channel: #1b1b1b -> #3b2b1b is 32
const getDistance = (data, pixel, color) => Math.max(
    Math.abs(data[pixel * 4] - color[0]),
    Math.abs(data[pixel * 4 + 1] - color[1]),
    Math.abs(data[pixel * 4 + 2] - color[2]),
)

// { transparent: true }, the edge's colour as { color: [r, g, b] }, or null when the edge has no single colour
const getBackground = ({ data, width, height }, options) => {
    const edgePixels = getEdgePixels(width, height)
    const transparentPixels = edgePixels.filter((pixel) => data[pixel * 4 + 3] < 128)
    if (transparentPixels.length >= edgePixels.length / 2) return { transparent: true }

    const color = [0, 1, 2].map((channel) => median(edgePixels.map((pixel) => data[pixel * 4 + channel])))
    const nearPixels = edgePixels.filter((pixel) => getDistance(data, pixel, color) <= options.backgroundDistance + options.backgroundFade)
    return nearPixels.length >= edgePixels.length * options.backgroundEdgeShare ? { color } : null
}

// The row where the subject's reflection starts (the middle of its rows), or null without one
const getReflectionRow = ({ weights, distances, width, height }, options) => {
    const rows = Array.from({ length: height }, (_, row) => {
        let [weight, contrast] = [0, 0]
        for (let pixel = row * width; pixel < (row + 1) * width; pixel++) {
            weight += weights[pixel]
            contrast += weights[pixel] * distances[pixel]
        }
        return { weight, contrast }
    })
    // Rows with subject in at least 2 % of the width, so stray crumbs don't count
    const subjectRows = rows.flatMap((row, index) => (row.weight > width * 0.02 ? [index] : []))
    if (subjectRows.length < 2) return null
    const [firstRow, lastRow] = [subjectRows[0], subjectRows[subjectRows.length - 1]]
    const middleRow = Math.round((firstRow + lastRow) / 2)
    const getContrast = (part) => part.reduce((sum, row) => sum + row.contrast, 0) / part.reduce((sum, row) => sum + row.weight, 0)
    const [upperContrast, lowerContrast] = [getContrast(rows.slice(firstRow, middleRow)), getContrast(rows.slice(middleRow, lastRow + 1))]
    return lowerContrast <= upperContrast * options.reflectionContrast ? middleRow : null
}

// How much each pixel is subject (0 to 1): its alpha, or how far it is from the background colour, halved in a
// mirror reflection
const getSubjectWeights = ({ data, width, height }, background, options) => {
    const weights = new Float32Array(width * height)
    if (background.transparent) {
        for (let pixel = 0; pixel < weights.length; pixel++) weights[pixel] = data[pixel * 4 + 3] / 255
        return { weights }
    }
    const distances = new Float32Array(width * height)
    for (let pixel = 0; pixel < weights.length; pixel++) {
        distances[pixel] = getDistance(data, pixel, background.color)
        weights[pixel] = Math.min(1, Math.max(0, (distances[pixel] - options.backgroundDistance) / options.backgroundFade))
    }
    const reflectionRow = getReflectionRow({ weights, distances, width, height }, options)
    if (reflectionRow !== null) for (let pixel = reflectionRow * width; pixel < weights.length; pixel++) weights[pixel] *= options.reflectionWeight
    return { weights, reflectionRow }
}

// Where the subject starts and ends along one axis, in fractions of the photo, leaving out `trim` of its weight
// on each side
const getTrimmedRange = (sums, trim) => {
    const total = sums.reduce((sum, value) => sum + value, 0)
    let [start, end, cumulative] = [0, 0, 0]
    for (let index = 0; index < sums.length; index++) {
        if (cumulative <= total * trim) start = index
        cumulative += sums[index]
        if (cumulative - sums[index] < total * (1 - trim)) end = index + 1
    }
    return { start: start / sums.length, end: end / sums.length }
}

// The subject's trimmed box, in fractions of the photo's width and height; null without a subject
const getSubjectBox = (weights, width, height, trim) => {
    const [columns, rows] = [new Float64Array(width), new Float64Array(height)]
    for (let pixel = 0; pixel < weights.length; pixel++) {
        columns[pixel % width] += weights[pixel]
        rows[Math.floor(pixel / width)] += weights[pixel]
    }
    if (!columns.some(Boolean)) return null
    return { x: getTrimmedRange(columns, trim), y: getTrimmedRange(rows, trim) }
}

const round = (value, decimals) => Number(value.toFixed(decimals))
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value))

// `image`: raw RGBA pixels and their size, as sharp's `.ensureAlpha().raw()` or a canvas' getImageData give them
const fitPhoto = (image, customOptions = {}) => {
    const options = { ...defaultOptions, ...customOptions }
    const background = getBackground(image, options)
    if (!background) return fitOriginal
    const { weights, reflectionRow } = getSubjectWeights(image, background, options)
    const subjectBox = getSubjectBox(weights, image.width, image.height, options.trim)
    if (!subjectBox) return fitOriginal
    // The img's height / the box's height at scale 1
    const heightInBox = (image.height / image.width) * options.boxRatio
    // An opaque photo always covers the box, or its edge shows
    const coverScale = background.transparent ? 0 : Math.max(1, 1 / heightInBox)
    const fillScale = options.centralArea / Math.max(subjectBox.x.end - subjectBox.x.start, (subjectBox.y.end - subjectBox.y.start) * heightInBox)
    const scale = Math.max(coverScale, Math.min(options.maxScale, Math.max(options.minScale, fillScale)))

    // The whole reflection fits in the box, but centring counts its height like its weight (half with 0.5), or the
    // subject sits too high
    const reflectionStart = reflectionRow === null || reflectionRow === undefined ? 1 : reflectionRow / image.height
    const centeredEnd = Math.min(subjectBox.y.end, reflectionStart + Math.max(0, subjectBox.y.end - reflectionStart) * options.reflectionWeight)
    let x = -scale * ((subjectBox.x.start + subjectBox.x.end) / 2 - 0.5) * 100
    let y = -scale * ((subjectBox.y.start + centeredEnd) / 2 - 0.5) * 100
    // An opaque photo moves at most what it overflows the box
    if (!background.transparent) {
        x = clamp(x, Math.max(0, (scale - 1) / 2) * 100)
        y = clamp(y, Math.max(0, (scale - 1 / heightInBox) / 2) * 100)
    }
    return { scale: round(scale, 2), x: round(x, 1), y: round(y, 1) }
}

module.exports = { fitPhoto, defaultOptions, getBackground, getSubjectWeights }

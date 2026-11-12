// What the site says about the restaurant (hours, phone, address, menu prices, dishes), worked out from restaurant.json
// and the dishes. CommonJS: the app imports it and so does scripts/write-page-heads.js, which Node runs
const restaurant = require('./restaurant.json')
const dishSections = require('../pedidos/dishes.copy.json')

const { phone, street, postalCode, city, openingHours, lunchMenu, dinnerMenu } = restaurant

// 1550 -> '15,50 €'
const formatPrice = (priceInCents) => `${Math.floor(priceInCents / 100)},${String(priceInCents % 100).padStart(2, '0')} €`

// '15,90 €' with a non-breaking space, so a price inside a text never ends up on two lines
const formatFactPrice = (priceInCents) => formatPrice(priceInCents).replace(' ', ' ')

// 100 -> '1 €'; 150 -> '1,50 €'
const formatShortPrice = (priceInCents) => (priceInCents % 100 ? formatFactPrice(priceInCents) : `${priceInCents / 100} €`)

// '+34 656 181 427' -> '34656181427'
const phoneDigits = phone.replace(/\D/g, '')
const address = `${street}, ${postalCode} ${city}`
const mapsQuery = encodeURIComponent(`${restaurant.name}, ${address}`)
// 'https://www.instagram.com/asiavilafranca/' -> '@asiavilafranca'
const instagramHandle = `@${restaurant.instagramUrl.split('/').filter(Boolean).pop()}`
const dishCount = dishSections.reduce((count, section) => count + section.dishes.length, 0)

// The order of restaurant.json's day names; 2024-01-01 was a Monday
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// The order of a day's shifts in openingHours; a shift left out of a day doesn't open ({} = closed all day)
const shiftKeys = ['lunch', 'dinner']

// How each language writes days and hours. A lone day range gets inSentence before it inside a sentence
// ('abierto de lunes a viernes') and onItsOwn when it stands alone ('De dilluns a divendres')
const languageWords = {
    es: { and: ' y ', everyDay: 'todos los días', everyDayExcept: 'todos los días menos el', inSentence: 'de ', onItsOwn: '', getDayRange: (first, last) => `${first} a ${last}`, getHourRange: (opens, closes) => `de ${opens} a ${closes}`, shiftNames: { lunch: 'Mediodía', dinner: 'Noche' } },
    ca: { and: ' i ', everyDay: 'cada dia', everyDayExcept: 'cada dia excepte el', inSentence: 'de ', onItsOwn: 'de ', getDayRange: (first, last) => `${first} a ${last}`, getHourRange: (opens, closes) => `de ${opens} a ${closes}`, shiftNames: { lunch: 'Migdia', dinner: 'Vespre' } },
    en: { and: ' and ', everyDay: 'every day', everyDayExcept: 'every day except', inSentence: 'from ', onItsOwn: '', getDayRange: (first, last) => `${first} to ${last}`, getHourRange: (opens, closes) => `from ${opens} to ${closes}`, shiftNames: { lunch: 'Lunch', dinner: 'Dinner' } },
}

const capitalize = (text) => text[0].toUpperCase() + text.slice(1)

// ['lunes', 'martes', 'jueves'] -> 'lunes, martes y jueves'
const joinWithAnd = (texts, and) => (texts.length < 2 ? texts.join('') : `${texts.slice(0, -1).join(', ')}${and}${texts.at(-1)}`)

// '12:30-16:00' -> '12:30 – 16:00'
const formatHours = (hours) => hours.replace('-', ' – ')

// ['Monday', ..., 'Friday'] -> { text: 'Lunes a viernes', inSentence: 'de lunes a viernes' } in that language.
// 7 days -> 'Todos los días'; 6 -> 'Todos los días menos el lunes'; 3 or more in a row -> a range, even across Sunday
const getDaysTexts = (days, language) => {
    const words = languageWords[language] ?? languageWords.es
    const dayNameFormat = new Intl.DateTimeFormat(language, { weekday: 'long', timeZone: 'UTC' })
    const getDayName = (weekday) => dayNameFormat.format(new Date(Date.UTC(2024, 0, 1 + weekdays.indexOf(weekday))))
    const missingDays = weekdays.filter((weekday) => !days.includes(weekday))
    if (!missingDays.length) return { text: capitalize(words.everyDay), inSentence: words.everyDay }
    if (missingDays.length === 1) {
        const exceptText = `${words.everyDayExcept} ${getDayName(missingDays[0])}`
        return { text: capitalize(exceptText), inSentence: exceptText }
    }

    // Starts the week after a missing day, so Saturday to Monday stays one run
    const firstDayIndex = (weekdays.indexOf(missingDays.at(-1)) + 1) % 7
    const week = [...weekdays.slice(firstDayIndex), ...weekdays.slice(0, firstDayIndex)]
    const runs = week.reduce((allRuns, weekday) => {
        if (!days.includes(weekday)) return [...allRuns, []]
        allRuns.at(-1).push(getDayName(weekday))
        return allRuns
    }, [[]]).filter((run) => run.length)
    const parts = runs.flatMap((run) => (run.length > 2 ? [words.getDayRange(run[0], run.at(-1))] : run))
    const text = joinWithAnd(parts, words.and)
    const isOneRange = runs.length === 1 && runs[0].length > 2
    if (!isOneRange) return { text: capitalize(text), inSentence: text }
    return { text: capitalize(`${words.onItsOwn}${text}`), inSentence: `${words.inSentence}${text}` }
}

// ('Monday', 'es') -> [{ key: 'lunch', name: 'Mediodía', opens: '12:30', closes: '16:00', time: '12:30 – 16:00' }, ...]; [] when closed
const getDayShifts = (weekday, language) => {
    const { shiftNames } = languageWords[language] ?? languageWords.es
    const dayHours = openingHours[weekday] ?? {}
    return shiftKeys.filter((shiftKey) => dayHours[shiftKey]).map((shiftKey) => {
        const [opens, closes] = dayHours[shiftKey].split('-')
        return { key: shiftKey, name: shiftNames[shiftKey], opens, closes, time: `${opens} – ${closes}` }
    })
}

// The open days grouped by equal hours, in week order: [{ weekdays: ['Monday', ...], days: 'Todos los días',
// daysInSentence: 'todos los días', shifts: [...], hours: '12:30 – 16:00 y 20:00 – 23:00' }]
const getSchedule = (language) => {
    const { and } = languageWords[language] ?? languageWords.es
    const openDays = weekdays.map((weekday) => ({ weekday, shifts: getDayShifts(weekday, language) })).filter(({ shifts }) => shifts.length)
    const getHoursKey = (shifts) => shifts.map(({ name, time }) => `${name} ${time}`).join()
    const hoursKeys = [...new Set(openDays.map(({ shifts }) => getHoursKey(shifts)))]
    return hoursKeys.map((hoursKey) => {
        const sameHoursDays = openDays.filter(({ shifts }) => getHoursKey(shifts) === hoursKey)
        const groupWeekdays = sameHoursDays.map(({ weekday }) => weekday)
        const daysTexts = getDaysTexts(groupWeekdays, language)
        const { shifts } = sameHoursDays[0]
        return { weekdays: groupWeekdays, days: daysTexts.text, daysInSentence: daysTexts.inSentence, shifts, hours: shifts.map(({ time }) => time).join(and) }
    })
}

// Each value as the pages write it in that language; a language without its own words gets the Spanish ones
const getFacts = (language) => {
    const { and, getHourRange } = languageWords[language] ?? languageWords.es
    const schedule = getSchedule(language)
    return {
        name: restaurant.name,
        brand: restaurant.brand,
        phone,
        // '656 181 427', as it's dialled from Spain
        phoneWithoutPrefix: phone.replace('+34 ', ''),
        phoneUrl: `tel:+${phoneDigits}`,
        whatsappUrl: `https://wa.me/${phoneDigits}`,
        instagramUrl: restaurant.instagramUrl,
        instagramHandle,
        facebookUrl: restaurant.facebookUrl,
        street,
        postalCode,
        town: city,
        address,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
        schedule,
        // Each day's shifts, for the booking form and today's hours: { Monday: [{ name: 'Mediodía', opens: '12:30', ... }], ... }
        weekShifts: Object.fromEntries(weekdays.map((weekday) => [weekday, getDayShifts(weekday, language)])),
        // 'Todos los días · 12:30 – 16:00 y 20:00 – 23:00'; days with other hours after '; '
        hoursText: schedule.map(({ days, hours }) => `${days} · ${hours}`).join('; '),
        // 'todos los días de 12:30 a 16:00 y de 20:00 a 23:00', to go inside a sentence
        openingText: schedule.map(({ daysInSentence, shifts }) => `${daysInSentence} ${shifts.map(({ opens, closes }) => getHourRange(opens, closes)).join(and)}`).join('; '),
        // 238 dishes -> '200', as in «más de 200 platos»
        dishCount: String(Math.floor(dishCount / 100) * 100),
        sectionCount: String(dishSections.length),
        lunchMenuPrice: formatFactPrice(lunchMenu.priceInCents),
        lunchMenuHours: formatHours(lunchMenu.hours),
        dinnerMenuPrice: formatFactPrice(dinnerMenu.priceInCents),
        dinnerMenuHours: formatHours(dinnerMenu.hours),
        // What the dinner menu costs more on fridays and holidays: '1 €'
        dinnerMenuExtra: formatShortPrice(dinnerMenu.fridayAndHolidayExtraInCents),
    }
}

// 'Abierto {openingText}' -> 'Abierto todos los días de 12:30 a 16:00 y de 20:00 a 23:00', in every text of an object too.
// Throws on a name getFacts doesn't have
const fillFacts = (texts, language) => {
    if (typeof texts !== 'string') return Object.fromEntries(Object.entries(texts).map(([key, text]) => [key, fillFacts(text, language)]))
    const facts = getFacts(language)
    return texts.replace(/\{(\w+)\}/g, (placeholder, factName) => {
        if (facts[factName] === undefined) throw new Error(`"${texts}" asks for {${factName}}, which restaurantFacts.js doesn't have`)
        return facts[factName]
    })
}

module.exports = { restaurant, formatPrice, getFacts, fillFacts }

// A crawler that runs no JS only reads the HTML file, so each route of each language gets its own copy of
// build/index.html (build/menu/index.html, build/ca/menu/index.html...) with its title, description, canonical,
// hreflang links and a <noscript> with its text. Also writes build/404.html and build/sitemap.xml,
// and adds the restaurant's data as schema.org Restaurant to every page and the dishes as schema.org Menu to /menu.
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const buildFolder = path.join(root, 'build')
const pageTexts = require(path.join(root, 'src/seo/pages.json'))
const { restaurant, getFacts, fillFacts } = require(path.join(root, 'src/data/restaurantFacts.js'))
const dishSections = require(path.join(root, 'public/dishes/dishes.json'))
const qrRoutes = require(path.join(root, 'src/seo/qrRoutes.json'))

const { siteUrl } = restaurant
const languages = Object.keys(pageTexts)
// '{openingText}', '{phoneWithoutPrefix}'... of each text replaced by the fact in its language
const texts = Object.fromEntries(languages.map((language) => [language, fillFacts(pageTexts[language], language)]))
const routes = Object.keys(texts.es.pages)
const home = texts.es.pages['/']
const homeHtml = fs.readFileSync(path.join(buildFolder, 'index.html'), 'utf8')

// ('ca', '/menu') -> '/ca/menu'; ('ca', '/') -> '/ca'; Spanish has nothing before the route
const getPath = (language, route) => (language === 'es' ? route : `/${language}${route === '/' ? '' : route}`)

// Throws when public/index.html and the Spanish home of pages.json no longer say the same
const replaceHomeText = (html, homeText, pageText) => {
    if (!html.includes(homeText)) throw new Error(`build/index.html doesn't have "${homeText}"`)
    return html.replaceAll(homeText, () => pageText)
}

const escapeHtml = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')

const getAlternateLinks = (route) => [...languages.map((language) => [language, language]), ['x-default', 'es']]
    .map(([hreflang, language]) => `<link rel="alternate" hreflang="${hreflang}" href="${siteUrl}${getPath(language, route)}"/>`)
    .join('')

const getNoscript = (language, route) => {
    const { pages, about, javascriptNotice } = texts[language]
    const links = routes.filter((otherRoute) => otherRoute !== route)
        .map((otherRoute) => `<a href="${getPath(language, otherRoute)}">${escapeHtml(pages[otherRoute].linkText)}</a>`)
    const paragraphs = [pages[route].description, about].map(escapeHtml)
    return `<noscript><h1>${escapeHtml(pages[route].heading)}</h1>${[...paragraphs, links.join(' · '), javascriptNotice].map((text) => `<p>${text}</p>`).join('')}</noscript>`
}

// '<' escaped so a text can't close the <script>
const toJsonLdScript = (jsonLd) => `<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>`

const restaurantScript = toJsonLdScript({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/#restaurant`,
    name: restaurant.name,
    url: `${siteUrl}/`,
    image: `${siteUrl}/og-image.webp`,
    logo: `${siteUrl}/LogoRed.webp`,
    telephone: restaurant.phone.replaceAll(' ', ''),
    priceRange: '€€',
    servesCuisine: ['China', 'Japonesa', 'Sushi'],
    hasMenu: `${siteUrl}/menu`,
    acceptsReservations: `${siteUrl}/reservar`,
    sameAs: [restaurant.instagramUrl, restaurant.facebookUrl],
    hasMap: getFacts('es').mapsUrl,
    openingHoursSpecification: getFacts('es').schedule.flatMap(({ weekdays, shifts }) => shifts.map(({ opens, closes }) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: weekdays, opens, closes }))),
    address: {
        '@type': 'PostalAddress',
        streetAddress: restaurant.street,
        postalCode: restaurant.postalCode,
        addressLocality: restaurant.city,
        addressRegion: restaurant.region,
        addressCountry: 'ES',
    },
})

const getMenuScript = (language) => {
    const menuJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Menu',
        '@id': `${siteUrl}${getPath(language, '/menu')}#menu`,
        name: texts[language].menuName,
        inLanguage: language,
        hasMenuSection: dishSections.map((section) => ({
            '@type': 'MenuSection',
            name: section.name[language] ?? section.name.es,
            hasMenuItem: section.dishes.map((dish) => ({
                '@type': 'MenuItem',
                name: dish.name[language] ?? dish.name.es,
                description: dish.description?.[language] || dish.description?.es || undefined,
                suitableForDiet: dish.isVegan ? 'https://schema.org/VeganDiet' : undefined,
                offers: { '@type': 'Offer', price: (dish.priceInCents / 100).toFixed(2), priceCurrency: 'EUR' },
            })),
        })),
    }
    return toJsonLdScript(menuJsonLd)
}

for (const language of languages) {
    for (const route of routes) {
        const page = texts[language].pages[route]
        const url = `${siteUrl}${getPath(language, route)}`
        let html = homeHtml
        html = replaceHomeText(html, home.title, escapeHtml(page.title))
        html = replaceHomeText(html, home.description, escapeHtml(page.description))
        html = replaceHomeText(html, `rel="canonical" href="${siteUrl}/"`, `rel="canonical" href="${url}"`)
        html = replaceHomeText(html, `property="og:url" content="${siteUrl}/"`, `property="og:url" content="${url}"`)
        html = replaceHomeText(html, '<html lang="es">', `<html lang="${language}">`)
        html = replaceHomeText(html, 'content="es_ES"', `content="${texts[language].ogLocale}"`)
        html = replaceHomeText(html, '</head>', `${getAlternateLinks(route)}${restaurantScript}${route === '/menu' ? getMenuScript(language) : ''}</head>`)
        html = replaceHomeText(html, '<div id="root">', `${getNoscript(language, route)}<div id="root">`)

        const folder = path.join(buildFolder, getPath(language, route))
        fs.mkdirSync(folder, { recursive: true })
        fs.writeFileSync(path.join(folder, 'index.html'), html)
    }
}

// Vercel serves build/404.html, with a 404 status, for a URL without a file: the app then shows NotFound
let notFoundHtml = replaceHomeText(homeHtml, home.title, escapeHtml(texts.es.notFoundTitle))
notFoundHtml = replaceHomeText(notFoundHtml, `<link rel="canonical" href="${siteUrl}/"/>`, '<meta name="robots" content="noindex"/>')
fs.writeFileSync(path.join(buildFolder, '404.html'), notFoundHtml)

// The QR codes on the tables open /qr and /qr-new: the home's HTML, out of search results
const qrHtml = replaceHomeText(homeHtml, `<link rel="canonical" href="${siteUrl}/"/>`, '<meta name="robots" content="noindex"/>')
for (const route of qrRoutes) {
    fs.mkdirSync(path.join(buildFolder, route), { recursive: true })
    fs.writeFileSync(path.join(buildFolder, route, 'index.html'), qrHtml)
}

const sitemapUrls = languages.flatMap((language) => routes.map((route) => `  <url><loc>${siteUrl}${getPath(language, route)}</loc></url>`))
fs.writeFileSync(
    path.join(buildFolder, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`
)

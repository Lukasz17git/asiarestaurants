// To add a language: one entry here, its key in each t({ es, ca, en }), dishes.json and seo/pages.json
export const languages = [
    { code: 'es', name: 'Castellano' },
    { code: 'ca', name: 'Català' },
    { code: 'en', name: 'English' },
]

const defaultLanguage = 'es'

// '/ca' and '/ca/menu' -> 'ca'; a path that starts with no language ('/', '/menu') is in Spanish
const firstFolder = window.location.pathname.split('/')[1]
export const language = languages.some(({ code }) => code === firstFolder) ? firstFolder : defaultLanguage

// ('en', '/menu') -> '/en/menu'; ('en', '/') -> '/en'; Spanish has nothing before the route
export const getLanguageUrl = (code, route) => (code === defaultLanguage ? route : `/${code}${route === '/' ? '' : route}`)

// Path before every route of the language: <BrowserRouter basename> adds it to each <Link>
export const basename = getLanguageUrl(language, '')

// { es: 'Bebidas', ca: 'Begudes', en: 'Drinks' } -> the text of the language; a text without it stays in Spanish
export const t = (texts) => texts?.[language] ?? texts?.[defaultLanguage]

export const orderOnlineLabel = { es: 'Pedir online', ca: 'Demanar online', en: 'Order online' }

document.documentElement.lang = language

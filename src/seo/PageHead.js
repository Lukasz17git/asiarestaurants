import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import pages from './pages.json'
import qrRoutes from './qrRoutes.json'
import { basename, language } from '../language'
import { fillPageFacts, restaurant } from '../data/facts'

const { siteUrl } = restaurant
const { pages: languagePages, notFoundTitle } = fillPageFacts(pages[language])

// '/qr' -> Home's title; any other URL without a page -> «Página no encontrada»
const getPageTitle = (route, page) => page?.title ?? (qrRoutes.includes(route) ? languagePages['/'].title : notFoundTitle)

// A URL without a page gets <meta name="robots" content="noindex">, as build/404.html has
const setNoindex = (isNoindex) => {
    const robots = document.querySelector('meta[name="robots"]')
    if (!isNoindex) return robots?.remove()
    if (robots) return
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.append(meta)
}

// Sets the title, description and canonical of the page on each client-side navigation
export default function PageHead() {
    const { pathname } = useLocation()

    useEffect(() => {
        // '/menu/' -> '/menu'
        const route = pathname.replace(/\/$/, '') || '/'
        const page = languagePages[route]
        document.title = getPageTitle(route, page)
        setNoindex(!page)
        if (!page) return
        document.querySelector('meta[name="description"]').content = page.description
        // build/404.html has no canonical
        const canonical = document.querySelector('link[rel="canonical"]')
        if (canonical) canonical.href = `${siteUrl}${basename}${route}`
    }, [pathname])

    return null
}

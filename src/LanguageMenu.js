import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getLanguageUrl, language, languages, t } from './language'

const GlobeIcon = () => (
    <svg className='language-globe' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'>
        <circle cx='12' cy='12' r='9' />
        <path d='M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z' />
    </svg>
)

// The same page in another language; <a>, not <Link>: the language is read from the URL when the page loads
export const LanguageLink = ({ code, children }) => {
    const route = useLocation().pathname
    return <a href={getLanguageUrl(code, route)} hrefLang={code} lang={code} aria-current={code === language ? 'true' : undefined}>{children}</a>
}

// Globe button of the navbar that opens the list of languages
const LanguageMenu = () => {
    const [isOpen, setIsOpen] = useState(false)
    const menu = useRef(null)

    // Closes with a click outside or Escape
    useEffect(() => {
        if (!isOpen) return
        const closeIfOutside = (event) => !menu.current.contains(event.target) && setIsOpen(false)
        const closeOnEscape = (event) => event.key === 'Escape' && setIsOpen(false)
        document.addEventListener('click', closeIfOutside)
        document.addEventListener('keydown', closeOnEscape)
        return () => {
            document.removeEventListener('click', closeIfOutside)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [isOpen])

    return (
        <div className={isOpen ? 'language-menu is-open' : 'language-menu'} ref={menu}>
            <button
                type='button'
                className='language-button'
                aria-expanded={isOpen}
                aria-label={t({ es: 'Cambiar de idioma', ca: "Canviar d'idioma", en: 'Change language' })}
                onClick={() => setIsOpen(!isOpen)}
            >
                <GlobeIcon />
                {language.toUpperCase()}
                <span className='language-arrow' aria-hidden='true' />
            </button>
            <ul className='language-list'>
                {languages.map(({ code, name }) => (
                    <li key={code}>
                        <LanguageLink code={code}>
                            <span className='language-code'>{code.toUpperCase()}</span>
                            {name}
                        </LanguageLink>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LanguageMenu

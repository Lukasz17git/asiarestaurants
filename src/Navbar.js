import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { facts } from './data/facts'
import { languages, t } from './language'
import LanguageMenu, { LanguageLink } from './LanguageMenu'
import './css/Navbar.scss'

// kanji: shown next to the name in the phone menu
const links = [
    { to: '/', name: { es: 'HOME', ca: 'INICI', en: 'HOME' }, kanji: '家' },
    { to: '/menu', name: { es: 'MENÚS', ca: 'MENÚS', en: 'MENUS' }, kanji: '菜单' },
    { to: '/reservar', name: { es: 'RESERVAR', ca: 'RESERVAR', en: 'BOOK' }, kanji: '予約' },
    { to: '/pedidos', name: { es: 'PEDIR ONLINE', ca: 'DEMANAR ONLINE', en: 'ORDER ONLINE' }, kanji: '外卖', className: 'link-order' },
    { to: '/restaurant', name: { es: 'RESTAURANTES', ca: 'RESTAURANTS', en: 'RESTAURANTS' }, kanji: '店' },
]

const Navbar = () => {
    const path = useLocation().pathname

    const [menu, setMenu] = useState(false)
    const hideMenu = () => setMenu(false)

    // Locks the page's scroll while the phone menu is open
    useEffect(() => {
        if (!menu) return
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [menu])

    return (
        <div className={menu ? 'navbar is-open' : 'navbar'}>
            <div className='bg-opacity' />
            <Link to='/'><div className='main-logo' ><span>home</span></div></Link>
            <LanguageMenu />
            <div className='menu-icon' onClick={() => setMenu(!menu)} />
            <div className='menu'>
                {links.map(({ to, name, kanji, className }, index) => (
                    <div key={to} className={['link', className, path === to && 'selected'].filter(Boolean).join(' ')} style={{ '--i': index }} onClick={hideMenu}>
                        <Link to={to}>
                            {t(name)}
                            <span className='link-kanji' aria-hidden='true'>{kanji}</span>
                            <div className='underline' />
                        </Link>
                    </div>
                ))}
                {/* On phones the languages go here and the globe button of the bar is hidden */}
                <div className='menu-languages'>
                    {languages.map(({ code, name }) => (
                        <LanguageLink key={code} code={code}>{name}</LanguageLink>
                    ))}
                </div>
                <div className='menu-info'>
                    <span>{facts.hoursText}</span>
                    <a href={facts.phoneUrl}>{facts.phone}</a>
                    <a href={facts.instagramUrl} target='_blank' rel='noreferrer'>{facts.instagramHandle}</a>
                </div>
            </div>
        </div>
    )
}

export default Navbar

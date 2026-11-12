import React from 'react'
import { Link } from 'react-router-dom'
import menus from '../Menu/MenusData'
import { revealDelay } from '../reveal/useReveal'
import { orderOnlineLabel, t } from '../language'
import './sections.scss'

// 午餐 · 晚餐 (lunch · dinner), one kanji per cloth of the noren
const norenKanji = ['午', '餐', '晚', '餐']

// «Nuestros Menús»: lunch, dinner and takeaway as washi cards with the photo half above them; each opens its PDF
const MenusSection = () => {
    return (
        <section className='menus-section section'>
            <div className='menus-noren' aria-hidden='true'>
                {norenKanji.map((kanji, index) => <span key={index}>{kanji}</span>)}
            </div>
            <div className='centered' data-reveal='up'>
                <p className='kicker'><em>菜单</em>Asia Oriental Taste</p>
                <h2 className='heading'>{t({ es: <>Nuestros <em>Menús</em></>, ca: <>Els nostres <em>Menús</em></>, en: <>Our <em>Menus</em></> })}</h2>
            </div>
            <div className='menu-cards'>
                {Object.values(menus).map(({ name, description, time, price, note, backdropKanji, photo, pdf, orderPage }, index) => (
                    <div key={backdropKanji} className='menu-card' data-reveal='up' style={revealDelay(index, 0.15)}>
                        <img className='menu-card-photo' src={photo} alt='' loading='lazy' />
                        <span className='menu-card-backdrop' aria-hidden='true'>{backdropKanji}</span>
                        <span className='menu-card-seal stamp' aria-hidden='true'>亚洲</span>
                        <h3>{t(name)}</h3>
                        <p className='menu-card-time'>{t(time)}</p>
                        <p className='menu-card-description'>{t(description)}</p>
                        {price && <span className='menu-card-price'>{price}</span>}
                        {note && <small>{t(note)}</small>}
                        <div className='menu-card-buttons'>
                            <a className='cta cta-red' href={pdf} target='_blank' rel='noreferrer'>{t({ es: 'Ver Carta', ca: 'Veure Carta', en: 'See Menu' })}</a>
                            {orderPage && <Link className='cta cta-outline on-paper' to={orderPage}>{t(orderOnlineLabel)}</Link>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default MenusSection

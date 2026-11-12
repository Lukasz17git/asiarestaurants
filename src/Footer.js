import React from 'react'
import { Link } from 'react-router-dom'
import { orderOnlineLabel, t } from './language'
import { facts } from './data/facts'
import menus from './Menu/MenusData'
import logo from './images/LogoRedIcon.webp'

const Footer = () => {
  const description = t({
    es: '¿Estás buscando cocina japonesa o china? ¡Con Asia Restaurantes estás en el lugar correcto! Sumérgete en la cultura asiática y prueba todos nuestros platos.',
    ca: 'Busques cuina japonesa o xinesa? Amb Asia Restaurants ets al lloc correcte! Submergeix-te en la cultura asiàtica i prova tots els nostres plats.',
    en: 'Looking for Japanese or Chinese food? With Asia Restaurants you are in the right place! Dive into Asian culture and try all our dishes.',
  })

  return (
    <footer className='footer'>
      <span className='footer-kanji' aria-hidden='true'>亚洲</span>
      <div className='footer-columns'>
        <div>
          <img className='footer-logo' src={logo} alt='' loading='lazy' />
          <b className='footer-brand'>{facts.brand}</b>
          <p>{description}</p>
        </div>
        <div>
          <h2 className='footer-heading'>{facts.name}</h2>
          <ul>
            <li>{facts.street}</li>
            <li>{facts.town}</li>
            <li><a href={facts.phoneUrl}>{facts.phone}</a></li>
            {facts.schedule.map(({ days, shifts }) => (
              <li key={days}>
                {days}
                {shifts.map(({ key, name, time }) => <span key={key} className='footer-shift'>{name} {time}</span>)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className='footer-heading'>{t({ es: 'Síguenos', ca: 'Segueix-nos', en: 'Follow us' })}</h2>
          <ul>
            <li><a href={facts.instagramUrl} target='_blank' rel='noreferrer'>Instagram</a></li>
            <li><a href={facts.facebookUrl} target='_blank' rel='noreferrer'>Facebook</a></li>
            <li><a href={facts.whatsappUrl} target='_blank' rel='noreferrer'>WhatsApp</a></li>
          </ul>
          <h2 className='footer-heading'>{t({ es: 'Cartas', ca: 'Cartes', en: 'Menus' })}</h2>
          <ul>
            <li><Link to='/menu'>{t({ es: 'Menús', ca: 'Menús', en: 'Set menus' })}</Link></li>
            <li><a href={menus.pedidos.pdf} target='_blank' rel='noreferrer'>{t(menus.pedidos.name)}</a></li>
            <li><Link to='/pedidos'>{t(orderOnlineLabel)}</Link></li>
            <li><Link to='/reservar'>{t({ es: 'Reservar', ca: 'Reservar', en: 'Book a table' })}</Link></li>
          </ul>
        </div>
      </div>
      <div className='footer-bottom'>
        <span>© 2026 Asia Restaurants. All Rights Reserved</span>
        <span>{facts.name}</span>
      </div>
    </footer>
  )
}

export default Footer

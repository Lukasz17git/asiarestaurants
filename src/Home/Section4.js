import React from 'react'
import { Link } from 'react-router-dom'
import { t } from '../language'
import { revealDelay } from '../reveal/useReveal'
import cocina from './cocinaData'

// Our cuisine: one tile per cuisine with its kanji; delivery on washi, the last one
const Section4 = () => {
  return (
    <section className='section4 section section-dark'>
      <div className='section-header' data-reveal='up'>
        <div>
          <p className='kicker'><em>厨房</em></p>
          <h2 className='heading'>{t({ es: <>Nuestra <em>Cocina</em></>, ca: <>La nostra <em>Cuina</em></>, en: <>Our <em>Cuisine</em></> })}</h2>
        </div>
        <Link className='cta cta-red' to='/menu'>{t({ es: 'Ver menús →', ca: 'Veure menús →', en: 'See menus →' })}</Link>
      </div>
      <div className='section4-grid'>
        {cocina.map(({ kanji, name, description }, index) => (
          <div key={kanji} className='section4-tile' data-reveal='up' style={revealDelay(index)}>
            <em aria-hidden='true'>{kanji}</em>
            <h3>{t(name)}</h3>
            <p>{t(description)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Section4

import React from 'react'
import { t } from '../language'
import { revealDelay } from '../reveal/useReveal'
import { facts } from '../data/facts'
import examples from './examplesData'

// Our most popular dishes: each dish on a red sun, coming out of its own photo dimmed; a note under the cards
const Section3 = () => {
  return (
    <section className='section3 section section-white'>
      <div className='section-header' data-reveal='up'>
        <div>
          <p className='kicker'><em>人气</em></p>
          <h2 className='heading'>{t({ es: <>Nuestros Platos <em>más Populares</em></>, ca: <>Els nostres Plats <em>més Populars</em></>, en: <>Our <em>most Popular</em> Dishes</> })}</h2>
        </div>
      </div>
      <div className='section3-grid'>
        {examples.map(({ name, photo, description }, index) => (
          <article key={name} className='section3-card' data-reveal='up' style={revealDelay(index)}>
            <img className='section3-backdrop' src={photo} alt='' loading='lazy' />
            <span className='section3-tag' aria-hidden='true'>人气</span>
            <div className='section3-dish'><img src={photo} alt={name} loading='lazy' /></div>
            <h3>{name}</h3>
            <p>{t(description)}</p>
          </article>
        ))}
      </div>
      <p className='lead section3-note' data-reveal='up'>
        {t({
          es: `Estos cuatro platos solo son una muestra: en nuestras cartas te esperan más de ${facts.dishCount} platos de la cocina china y japonesa.`,
          ca: `Aquests quatre plats només en són una mostra: a les nostres cartes t'esperen més de ${facts.dishCount} plats de la cuina xinesa i japonesa.`,
          en: `These four dishes are only a taste: our menus hold more than ${facts.dishCount} Chinese and Japanese dishes.`,
        })}
      </p>
    </section>
  )
}

export default Section3

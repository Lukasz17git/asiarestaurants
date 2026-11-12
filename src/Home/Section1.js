import React from 'react'
import { t } from '../language'
import { facts } from '../data/facts'
import { revealDelay } from '../reveal/useReveal'
import tablePhoto from '../images/home/home1.webp'
import sushiPhoto from '../images/home/home3.webp'
import uramakiPhoto from '../images/home/home17.webp'
import ramenPhoto from '../images/home/home9.webp'
import dimSumPhoto from '../images/home/home12.webp'

const stripPhotos = [tablePhoto, sushiPhoto, uramakiPhoto, ramenPhoto, dimSumPhoto]

// Who we are: a short title over the first sentence, a tilted photo strip with the dish count, then the other two
const Section1 = () => {
  return (
    <section className='section1 section section-dark centered'>
      <span className='backdrop-kanji' aria-hidden='true'>传统</span>
      <div data-reveal='up'>
        <p className='kicker'><em>我们</em>{t({ es: '¿Quiénes somos?', ca: 'Qui som?', en: 'Who are we?' })} · Asia Restaurants</p>
        <h2 className='heading section1-title'>
          {t({
            es: <>Recetas <em>tradicionales y originales</em></>,
            ca: <>Receptes <em>tradicionals i originals</em></>,
            en: <>Traditional and <em>original recipes</em></>,
          })}
        </h2>
        <p className='lead section1-description'>
          {t({
            es: 'En nuestros Restaurantes ASIA proporcionamos las recetas más tradicionales y originales de la cocina oriental.',
            ca: 'Als nostres Restaurants ASIA oferim les receptes més tradicionals i originals de la cuina oriental.',
            en: 'At our ASIA Restaurants we serve the most traditional and original recipes of Eastern cuisine.',
          })}
        </p>
      </div>
      <div className='section1-strip'>
        <div className='section1-badge sun-disc' data-reveal='zoom'>
          <b>+{facts.dishCount}</b>
          <small>{t({ es: 'Platos', ca: 'Plats', en: 'Dishes' })}</small>
        </div>
        {stripPhotos.map((photo, index) => <img key={photo} src={photo} alt='' loading='lazy' data-reveal='up' style={revealDelay(index, 0.08)} />)}
      </div>
      <div className='section1-lines' data-reveal='up'>
        <p>
          {t({
            es: 'Especialistas en fusión, desde la cultura china hasta la cultura japonesa. En una misma carta encontrarás dim sum, gua bao y fideos chinos junto a sushi, ramen y tempura.',
            ca: 'Especialistes en fusió, des de la cultura xinesa fins a la cultura japonesa. En una mateixa carta trobaràs dim sum, gua bao i fideus xinesos al costat de sushi, ramen i tempura.',
            en: 'Fusion specialists, from Chinese to Japanese culture. On the same menu you will find dim sum, gua bao and Chinese noodles next to sushi, ramen and tempura.',
          })}
        </p>
        <p>
          {t({
            es: `¡Tenemos más de ${facts.dishCount} platos ansiosos para ser probados! Ven a comer o a cenar al restaurante, recógelos para llevar o pídelos a domicilio.`,
            ca: `Tenim més de ${facts.dishCount} plats impacients per ser tastats! Vine a dinar o a sopar al restaurant, recull-los per emportar o demana'ls a domicili.`,
            en: `We have more than ${facts.dishCount} dishes waiting to be tried! Come for lunch or dinner, pick them up to take away or order them for delivery.`,
          })}
        </p>
      </div>
    </section>
  )
}

export default Section1

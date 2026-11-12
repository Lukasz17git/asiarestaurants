import React, { Fragment, useRef } from 'react'
import Footer from '../Footer'
import PageHero from '../sections/PageHero'
import Restaurant from './Restaurant'
import restaurants from './restaurantsData'
import { useReveal } from '../reveal/useReveal'
import { t } from '../language'
import '../css/Restaurant.scss'

const countryNames = {
    spain: { es: 'España', ca: 'Espanya', en: 'Spain' },
    italy: { es: 'Italia', ca: 'Itàlia', en: 'Italy' },
}

const numberKanji = ['一', '二', '三', '四']

// One photo card per restaurant, each a link to its block below
const RestaurantLinks = () => (
    <ol className='restaurants-hero-list'>
        {restaurants.map(({ id, town, country, photo }, index) => (
            <li key={id}>
                <a href={`#${id}`}>
                    <img src={photo} alt='' />
                    <em aria-hidden='true'>{numberKanji[index]}</em>
                    <b>{town}</b>
                    <span>{t(countryNames[country])}</span>
                </a>
            </li>
        ))}
    </ol>
)

const Restaurants = () => {
    const pageRef = useRef(null)
    useReveal(pageRef)

    return (
        <div className='main-restaurant' ref={pageRef}>
            <PageHero
                kanji='店'
                kicker='Asia Restaurants'
                title={t({
                    es: <>Con pasión y cuidadoso detalle <em>desde el 2006</em></>,
                    ca: <>Amb passió i cura del detall <em>des del 2006</em></>,
                    en: <>With passion and careful detail <em>since 2006</em></>,
                })}
                aside={<RestaurantLinks />}
            />
            {restaurants.map((restaurant, index) => (
                <Fragment key={restaurant.id}>
                    {index > 0 && <div className='restaurant-line' />}
                    <Restaurant restaurant={restaurant} isFlipped={index % 2 === 1} />
                </Fragment>
            ))}
            <Footer />
        </div>
    )
}

export default Restaurants

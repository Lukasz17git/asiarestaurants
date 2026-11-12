import React from 'react'
import { t } from '../language'
import spainFlag from '../images/spainIcon.svg'
import italyFlag from '../images/italyIcon.svg'
import './sections.scss'

const flags = { spain: spainFlag, italy: italyFlag }

// 'Asia Oriental Taste' -> Asia <em>Oriental Taste</em>
const splitName = (name) => {
    const [firstWord, ...rest] = name.split(' ')
    return <>{firstWord} <em>{rest.join(' ')}</em></>
}

// One restaurant of restaurantsData: its text and facts beside its photo and map
const RestaurantCard = ({ restaurant }) => {
    const { id, name, country, street, phone, maps, whatsapp, photo, hours, description } = restaurant
    const phoneUrl = `tel:${phone.replace(/\s/g, '')}`
    const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${street}`)}`

    return (
        <article id={id} className='restaurant-card' data-reveal='up'>
            <div className='restaurant-card-text'>
                <p className='kicker'>
                    <em>亚洲</em>
                    {t({ es: 'Restaurante', ca: 'Restaurant', en: 'Restaurant' })}
                    <img className='restaurant-card-flag' src={flags[country]} alt='' />
                </p>
                <h2 className='heading'>{splitName(name)}</h2>
                <p className='restaurant-card-description'>{t(description)}</p>
                <dl className='restaurant-card-facts'>
                    <div>
                        <dt>{t({ es: 'Dirección', ca: 'Adreça', en: 'Address' })}</dt>
                        <dd>{street}</dd>
                    </div>
                    <div>
                        <dt>{t({ es: 'Teléfono', ca: 'Telèfon', en: 'Phone' })}</dt>
                        <dd><a href={phoneUrl}>{phone}</a></dd>
                    </div>
                    {hours && (
                        <div>
                            <dt>{t({ es: 'Horario', ca: 'Horari', en: 'Hours' })}</dt>
                            <dd>{hours}</dd>
                        </div>
                    )}
                </dl>
                <div className='cta-bar'>
                    <a className='cta cta-red' href={whatsapp} target='_blank' rel='noreferrer'>{t({ es: 'Háblanos →', ca: 'Parla’ns →', en: 'Message us →' })}</a>
                    <a href={phoneUrl}>{t({ es: 'Llamar', ca: 'Trucar', en: 'Call' })}</a>
                    <a href={directionsUrl} target='_blank' rel='noreferrer'>{t({ es: 'Cómo llegar', ca: 'Com arribar-hi', en: 'Directions' })}</a>
                </div>
            </div>
            <div className='restaurant-card-pictures'>
                <img src={photo} alt={name} loading='lazy' />
                <iframe title={name} src={maps} loading='lazy' />
            </div>
        </article>
    )
}

export default RestaurantCard

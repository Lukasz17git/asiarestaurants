import React from 'react'
import { t } from '../language'

// One <span> per word, so the gold gradient covers each word and not the whole line
const toGoldWords = (text) => text.split(' ').map((word, index) => <span key={index}>{index > 0 && ' '}{word}</span>)

// One restaurant: title, description, photo, address, WhatsApp and map; isFlipped puts the photo on the right
const Restaurant = ({ restaurant, isFlipped }) => {
    const { id, name, country, street, phone, maps, whatsapp, photo, description } = restaurant

    return (
        <section id={id} className={isFlipped ? 'restaurant is-flipped' : 'restaurant'}>
            <h2 className='title'>{toGoldWords(`${t({ es: 'Restaurante', ca: 'Restaurant', en: 'Restaurant' })} ${name}`)}</h2>
            <p className='description'>{t(description)}</p>
            <div className='section-container'>
                <div className='wrapper1'>
                    <img alt={name} src={photo} loading='lazy' />
                </div>
                <div className='wrapper2'>
                    <div className='info'>
                        <div className={`country ${country}`} />
                        <div className='wrapper'>
                            <div className='street'>{t({ es: 'C:', ca: 'C:', en: 'Address:' })} {street}</div>
                            <div className='phone'>{t({ es: 'Tlf:', ca: 'Tel:', en: 'Phone:' })} {phone}</div>
                        </div>
                        <a className='whatsapp' href={whatsapp} target='_blank' rel='noreferrer'>
                            <div className='icon'></div>
                            <div>{t({ es: 'Háblanos', ca: 'Parla’ns', en: 'Message us' })}</div>
                        </a>
                    </div>
                    <div className='maps'>
                        <iframe title={name} src={maps} loading='lazy' />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Restaurant

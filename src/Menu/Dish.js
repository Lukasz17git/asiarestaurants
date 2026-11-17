import React from 'react'
import { formatPrice } from '../data/facts'
import { t } from '../language'
import { allergenNames } from '../data/allergens'

// After the 12th dish they all come in together, so a long section doesn't take seconds to appear
const maxDelayedDishes = 12

const Dish = ({ dish, index }) => {
    const { number, name, description, priceInCents, photoUrl, isVegan, isSpicy } = dish
    const animationDelay = `${Math.min(index, maxDelayedDishes) * 0.05}s`

    return (
        <article className='dish-container' style={{ animationDelay }}>
            <div className='photo'>
                {photoUrl
                    ? <img alt={t(name)} src={photoUrl} loading='lazy' />
                    : <span className='photo-placeholder' aria-hidden='true'>{number}</span>}
            </div>
            <div className='dish-body'>
                <h3 className='name'>{t(name)}</h3>
                {description && <p className='dish-description'>{description}</p>}
                {!!dish.allergens?.length && (<p className='dish-allergens'>{t({ es: 'Alérgenos', ca: 'Al·lèrgens', en: 'Allergens' })}: {dish.allergens.map((key) => t(allergenNames[key])).join(', ')}</p>)}
                <div className='dish-footer'>
                    <span className='dish-price'>{formatPrice(priceInCents)}</span>
                    {isVegan && <span className='dish-tag is-vegan'>{t({ es: 'Vegano', ca: 'Vegà', en: 'Vegan' })}</span>}
                    {isSpicy && <span className='dish-tag is-spicy'>{t({ es: 'Picante', ca: 'Picant', en: 'Spicy' })}</span>}
                </div>
            </div>
        </article>
    )
}

export default Dish

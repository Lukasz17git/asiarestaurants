import React from 'react'
import { formatPrice } from '../data/facts'
import { t } from '../language'
import { allergenNames } from '../data/allergens'
import { formatPieces } from '../pedidos/DishCard'

// After the 12th dish they all come in together, so a long section doesn't take seconds to appear
const maxDelayedDishes = 12

// The photo opens the dish in DishPhotoDialog; its button covers the whole card
const Dish = ({ dish, index, onOpen }) => {
    const { number, name, description, priceInCents, pieces, photoUrl, isVegan, isSpicy } = dish
    const animationDelay = `${Math.min(index, maxDelayedDishes) * 0.05}s`

    return (
        <article className='dish-container' style={{ animationDelay }}>
            {photoUrl
                ? (
                    <button type='button' className='photo' onClick={onOpen} aria-label={`${t({ es: 'Ver', ca: 'Veure', en: 'See' })} ${t(name)}`}>
                        <img alt={t(name)} src={photoUrl} loading='lazy' />
                    </button>
                )
                : <div className='photo'><span className='photo-placeholder' aria-hidden='true'>{number}</span></div>}
            <div className='dish-body'>
                <h3 className='name'>{t(name)}</h3>
                {description && <p className='dish-description'>{description}</p>}
                {!!dish.allergens?.length && (<p className='dish-allergens'>{t({ es: 'Alérgenos', ca: 'Al·lèrgens', en: 'Allergens' })}: {dish.allergens.map((key) => t(allergenNames[key])).join(', ')}</p>)}
                <div className='dish-footer'>
                    <span className='dish-price'>{formatPrice(priceInCents)}</span>
                    {pieces > 1 && <span className='dish-tag is-pieces'>{formatPieces(pieces)}</span>}
                    {isVegan && <span className='dish-tag is-vegan'>{t({ es: 'Vegano', ca: 'Vegà', en: 'Vegan' })}</span>}
                    {isSpicy && <span className='dish-tag is-spicy'>{t({ es: 'Picante', ca: 'Picant', en: 'Spicy' })}</span>}
                </div>
            </div>
        </article>
    )
}

export default Dish

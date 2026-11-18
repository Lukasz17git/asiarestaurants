import React from 'react'
import logoUrl from '../images/LogoRedIcon.webp'
import { formatPrice } from '../data/facts'
import { t } from '../language'
import { allergenNames } from '../data/allergens'

export const QuantityControl = ({ quantity, name, onChange, size }) => (
    <div className={`pedidos-quantity ${size ?? ''}`}>
        <button type='button' onClick={() => onChange(-1)} aria-label={`${t({ es: 'Quitar uno de', ca: 'Treure un de', en: 'Remove one' })} ${name}`}>−</button>
        <span aria-live='polite'>{quantity}</span>
        <button type='button' onClick={() => onChange(1)} aria-label={`${t({ es: 'Añadir otro de', ca: 'Afegir-ne un altre de', en: 'Add another' })} ${name}`}>+</button>
    </div>
)

// From scripts/fit-dish-photos.js: makes every plate fill the card about the same. scale as a string, since
// React would add 'px' to the number; --photo-ratio (height / width) only for photos that aren't square
export const getPhotoFitStyle = (photoFit) => photoFit && {
    scale: String(photoFit.scale),
    translate: `${photoFit.x}% ${photoFit.y}%`,
    '--photo-ratio': photoFit.ratio,
}

// '8 uds.', as a red seal on the card's photo and in DishPhotoDialog
export const formatPieces = (pieces) => `${pieces} ${t({ es: 'uds.', ca: 'u.', en: 'pcs' })}`

const DishCard = ({ dish, quantity, onChange, onOpenPhoto }) => (
    <article className={quantity ? 'pedidos-dish in-cart' : 'pedidos-dish'}>
        <span className='pedidos-dish-number'>{dish.number}</span>
        {/* A single piece needs no badge */}
        {dish.pieces > 1 && <span className='pedidos-dish-pieces'>{formatPieces(dish.pieces)}</span>}
        {dish.photoUrl
            ? (
                <button type='button' className='pedidos-dish-media' onClick={onOpenPhoto} aria-label={`${t({ es: 'Ver la foto de', ca: 'Veure la foto de', en: 'See the photo of' })} ${t(dish.name)}`}>
                    <img src={dish.photoUrl} alt={t(dish.name)} loading='lazy' style={getPhotoFitStyle(dish.photoFit)} />
                </button>
            )
            : <div className='pedidos-dish-media'><div className='pedidos-dish-placeholder' aria-hidden='true'><img src={logoUrl} alt='' /></div></div>}
        <div className='pedidos-dish-body'>
            <h3>
                {t(dish.name)}
                {dish.isVegan && <span className='pedidos-tag vegan'>{t({ es: 'Vegano', ca: 'Vegà', en: 'Vegan' })}</span>}
                {dish.isSpicy && <span className='pedidos-tag spicy'>{t({ es: 'Picante', ca: 'Picant', en: 'Spicy' })}</span>}
            </h3>
            {dish.description && <p className='pedidos-dish-description'>{dish.description}</p>}
            {!!dish.allergens?.length && (<p className='pedidos-dish-allergens'>{t({ es: 'Alérgenos', ca: 'Al·lèrgens', en: 'Allergens' })}: {dish.allergens.map((key) => t(allergenNames[key])).join(', ')}</p>)}
            <div className='pedidos-dish-footer'>
                <span className='pedidos-dish-price'>{formatPrice(dish.priceInCents)}</span>
                {quantity
                    ? <QuantityControl quantity={quantity} name={t(dish.name)} onChange={onChange} />
                    : <button type='button' className='pedidos-add' onClick={() => onChange(1)} aria-label={`${t({ es: 'Añadir', ca: 'Afegir', en: 'Add' })} ${t(dish.name)}`}>+</button>}
            </div>
        </div>
    </article>
)

export default DishCard

import React from 'react'
import logoUrl from '../images/LogoRedIcon.webp'
import { formatPrice } from '../data/facts'
import { t } from '../language'

export const QuantityControl = ({ quantity, name, onChange, size }) => (
    <div className={`pedidos-quantity ${size ?? ''}`}>
        <button type='button' onClick={() => onChange(-1)} aria-label={`${t({ es: 'Quitar uno de', ca: 'Treure un de', en: 'Remove one' })} ${name}`}>−</button>
        <span aria-live='polite'>{quantity}</span>
        <button type='button' onClick={() => onChange(1)} aria-label={`${t({ es: 'Añadir otro de', ca: 'Afegir-ne un altre de', en: 'Add another' })} ${name}`}>+</button>
    </div>
)

const DishCard = ({ dish, quantity, onChange }) => (
    <article className={quantity ? 'pedidos-dish in-cart' : 'pedidos-dish'}>
        <span className='pedidos-dish-number'>{dish.number}</span>
        <div className='pedidos-dish-media'>
            {dish.photoUrl
                ? <img src={dish.photoUrl} alt={t(dish.name)} loading='lazy' />
                : <div className='pedidos-dish-placeholder' aria-hidden='true'><img src={logoUrl} alt='' /></div>}
        </div>
        <div className='pedidos-dish-body'>
            <h3>
                {t(dish.name)}
                {dish.isVegan && <span className='pedidos-tag vegan'>{t({ es: 'Vegano', ca: 'Vegà', en: 'Vegan' })}</span>}
                {dish.isSpicy && <span className='pedidos-tag spicy'>{t({ es: 'Picante', ca: 'Picant', en: 'Spicy' })}</span>}
            </h3>
            {dish.description && <p className='pedidos-dish-description'>{dish.description}</p>}
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

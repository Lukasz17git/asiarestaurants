import React, { useEffect, useRef } from 'react'
import ShareButtons from './ShareButtons'
import { formatPieces } from './DishCard'
import { facts, formatPrice } from '../data/facts'
import { basename, t } from '../language'

// '/ca/pedidos?buscar=117': opens the menu filtered to that dish, in the same language
const getDishUrl = (dish) => `${window.location.origin}${basename}/pedidos?buscar=${dish.number}`

// The card's photoFit in this square box: y was measured in % of the card's height, 1.2 times shorter than its
// width. Kept within what the photo overflows, or an opaque photo's square edge would show
const getSquarePhotoFitStyle = (photoFit) => {
    if (!photoFit) return undefined
    const maxShift = ((photoFit.scale - 1) / 2) * 100
    const [x, y] = [photoFit.x, photoFit.y / 1.2].map((shift) => Math.max(-maxShift, Math.min(maxShift, shift)))
    return { scale: String(photoFit.scale), translate: `${x}% ${y}%` }
}

// The dish's photo, enlarged like on its card, with its name, price and share buttons
const DishPhotoDialog = ({ dish, section, onClose }) => {
    const dialogRef = useRef(null)
    const name = t(dish.name)
    const shareText = `${dish.number}. ${name} (${formatPrice(dish.priceInCents)}) ${t({ es: 'en', ca: 'a', en: 'at' })} ${facts.name}`

    // showModal() puts it above the page, closes it with Esc and keeps the focus inside;
    // StrictMode runs this twice, and older browsers throw on a second showModal()
    useEffect(() => {
        if (!dialogRef.current.open) dialogRef.current.showModal()
    }, [])

    // A click outside the card lands on the dialog itself, whose padding covers the backdrop's edge
    const closeOnBackdropClick = (event) => event.target === event.currentTarget && dialogRef.current.close()

    return (
        <dialog ref={dialogRef} className='pedidos-photo-dialog' aria-label={name} onClose={onClose} onClick={closeOnBackdropClick}>
            <div className='pedidos-photo-dialog-card'>
                <div className='pedidos-photo-dialog-media'>
                    <span className='pedidos-dish-number'>{dish.number}</span>
                    <button type='button' className='pedidos-photo-dialog-close' onClick={() => dialogRef.current.close()} aria-label={t({ es: 'Cerrar', ca: 'Tancar', en: 'Close' })}>×</button>
                    <img src={dish.photoUrl} alt={name} style={getSquarePhotoFitStyle(dish.photoFit)} />
                    {dish.pieces > 1 && <span className='pedidos-dish-pieces'>{formatPieces(dish.pieces)}</span>}
                </div>
                <div className='pedidos-photo-dialog-body'>
                    <p className='pedidos-photo-dialog-section'>
                        {section.kanji && <b aria-hidden='true'>{section.kanji}</b>}
                        {section.name}
                    </p>
                    <h3>{name}</h3>
                    {dish.description && <p className='pedidos-photo-dialog-description'>{dish.description}</p>}
                    <p className='pedidos-photo-dialog-price'>{formatPrice(dish.priceInCents)}</p>
                    <div className='pedidos-photo-dialog-share'>
                        <p className='pedidos-photo-dialog-share-title'>{t({ es: 'Comparte con tus amigos', ca: 'Comparteix amb els teus amics', en: 'Share with your friends' })}</p>
                        <p>{t({ es: 'Les llega el plato con su enlace para pedirlo', ca: 'Els arriba el plat amb el seu enllaç per demanar-lo', en: 'They get the dish with its link to order it' })}</p>
                        <ShareButtons text={shareText} url={getDishUrl(dish)} variant='panel' />
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default DishPhotoDialog

import React, { useState } from 'react'
import { countEvent } from '../analytics'
import { t } from '../language'

// Instagram has no share link: on phones its share menu lists Instagram, Telegram and the rest
const hasShareMenu = typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches

// 'pills' is a row of buttons; 'panel' shows them as round icons plus the link with its own copy button
const ShareButtons = ({ text, url, variant = 'pills' }) => {
    const [isCopied, setIsCopied] = useState(false)

    const copyLink = async () => {
        await navigator.clipboard.writeText(url)
        setIsCopied(true)
    }

    // Closing the share menu without sharing rejects the promise, so the error is ignored. On a computer it
    // copies the link to paste in Instagram, before opening it takes the focus the clipboard needs
    const shareOnInstagram = async () => {
        countEvent('share-instagram')
        if (hasShareMenu) return navigator.share({ text, url }).catch(() => {})
        await copyLink()
        window.open('https://www.instagram.com/', '_blank', 'noreferrer')
    }

    const copyLinkAndCount = () => {
        countEvent('share-copy')
        copyLink()
    }

    const copyLabel = isCopied ? t({ es: 'Copiado', ca: 'Copiat', en: 'Copied' }) : t({ es: 'Copiar', ca: 'Copiar', en: 'Copy' })

    return (
        <div className={`pedidos-share ${variant}`}>
            <div className='pedidos-share-buttons'>
                <a className='whatsapp' href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`} target='_blank' rel='noreferrer'>
                    <i className='pedidos-share-icon' aria-hidden='true' />WhatsApp
                </a>
                <button type='button' className='instagram' onClick={shareOnInstagram}>
                    <i className='pedidos-share-icon' aria-hidden='true' />Instagram
                </button>
                <a className='facebook' href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target='_blank' rel='noreferrer'>
                    <i className='pedidos-share-icon' aria-hidden='true' />Facebook
                </a>
                <button type='button' className='copy' onClick={copyLinkAndCount}>
                    <i className='pedidos-share-icon' aria-hidden='true' />{copyLabel}
                </button>
            </div>
            {variant === 'panel' && (
                <div className='pedidos-share-link'>
                    <span>{url.replace(/^https?:\/\//, '')}</span>
                    <button type='button' className='copy' onClick={copyLinkAndCount}>
                        <i className='pedidos-share-icon' aria-hidden='true' />{copyLabel}
                    </button>
                </div>
            )}
        </div>
    )
}

export default ShareButtons

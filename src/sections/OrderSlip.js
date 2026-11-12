import React from 'react'
import { Link } from 'react-router-dom'
import menus from '../Menu/MenusData'
import { orderOnlineLabel, t } from '../language'
import takeawayPhoto from '../images/menus/takeAway.webp'
import './sections.scss'

// An order slip (the takeaway menu's PDF on a dotted line, then «Pedir online») beside the takeaway photo in a red ring
const OrderSlip = ({ label, title, text, pdfButton }) => {
    return (
        <section className='order-slip section section-dark'>
            <div className='order-slip-paper' data-reveal='left'>
                <div className='order-slip-top'>
                    <span>{label}</span>
                    <span className='stamp' aria-hidden='true'>亚洲</span>
                </div>
                <h2 className='heading'>{title}</h2>
                <p className='order-slip-text'>{text}</p>
                <a className='order-slip-line' href={menus.pedidos.pdf} target='_blank' rel='noreferrer'>
                    <span>{t(menus.pedidos.name)}</span>
                    <i aria-hidden='true' />
                    <b>{pdfButton}</b>
                </a>
                <Link className='cta cta-red' to='/pedidos'>{t(orderOnlineLabel)} →</Link>
            </div>
            <div className='order-slip-photo' data-reveal='right'>
                <img src={takeawayPhoto} alt='' loading='lazy' />
            </div>
        </section>
    )
}

export default OrderSlip

import React, { useState } from 'react'
import { QuantityControl } from './DishCard'
import { getDeliveryQuote, outsideVilafrancaZone, vilafrancaZone } from './deliveryRules'
import { createOrderMessage, createWhatsappUrl } from './whatsappOrder'
import { t } from '../language'
import { facts, formatPrice, formatShortPrice } from '../data/facts'
import { ErrorAlert, FormField, NameAndPhoneFields, getNameAndPhoneErrors, keepFailedFields } from '../sections/contactForm'

const Field = (props) => <FormField className='pedidos-field' {...props} />

// Field -> message; only the fields that stop the order
const getErrors = ({ cartItems, customer, type, quote }) => {
    const errors = {
        cart: !cartItems.length && t({ es: 'Añade al menos un plato.', ca: 'Afegeix almenys un plat.', en: 'Add at least one dish.' }),
        ...getNameAndPhoneErrors(customer),
        address: type === 'delivery' && !customer.address.trim() && t({ es: 'Escribe la dirección de entrega.', ca: "Escriu l'adreça de lliurament.", en: 'Enter the delivery address.' }),
        postalCode: (quote.status === 'missingPostalCode' && t({ es: 'Escribe tu código postal.', ca: 'Escriu el teu codi postal.', en: 'Enter your postcode.' })) || (quote.status === 'invalidPostalCode' && t({ es: 'El código postal tiene 5 números.', ca: 'El codi postal té 5 números.', en: 'The postcode has 5 digits.' })),
        minimum: quote.status === 'belowMinimum'
            && t(
                { es: `Te faltan ${formatPrice(quote.missingForMinimumInCents)} para el mínimo de ${formatShortPrice(quote.minimumOrderInCents)}.`, ca: `Et falten ${formatPrice(quote.missingForMinimumInCents)} per al mínim de ${formatShortPrice(quote.minimumOrderInCents)}.`, en: `Add ${formatPrice(quote.missingForMinimumInCents)} to reach the ${formatShortPrice(quote.minimumOrderInCents)} minimum.` }
            ),
    }
    return keepFailedFields(errors)
}

const vilafrancaFreeFromText = formatShortPrice(vilafrancaZone.freeDeliveryFromInCents)
const outsideMinimumText = formatShortPrice(outsideVilafrancaZone.minimumOrderInCents)

// Only for Vilafranca; both rates are on the "Entrega a domicilio" button
const getDeliveryInfo = (type, quote) => {
    if (type === 'pickup') return t({ es: `Recoges el pedido en ${facts.address}. Sin gastos de envío ni pedido mínimo.`, ca: `Reculls la comanda a ${facts.address}. Sense despeses d'enviament ni comanda mínima.`, en: `You pick up the order at ${facts.address}. No delivery fee and no minimum order.` })
    if (!quote.isVilafranca) return ''
    if (quote.missingForFreeDeliveryInCents > 0) return t({ es: `Añade ${formatPrice(quote.missingForFreeDeliveryInCents)} más y el envío a Vilafranca es gratis.`, ca: `Afegeix ${formatPrice(quote.missingForFreeDeliveryInCents)} més i l'enviament a Vilafranca és gratis.`, en: `Add ${formatPrice(quote.missingForFreeDeliveryInCents)} more and delivery to Vilafranca is free.` })
    return t({ es: `¡Envío gratis! Tu pedido a Vilafranca es de ${vilafrancaFreeFromText} o más.`, ca: `Enviament gratis! La teva comanda a Vilafranca és de ${vilafrancaFreeFromText} o més.`, en: `Free delivery! Your order to Vilafranca is ${vilafrancaFreeFromText} or more.` })
}

const getDeliveryFeeText = (type, quote) => {
    if (type === 'pickup') return formatPrice(0)
    // No fee yet while the postal code is missing or wrong
    if (quote.deliveryFeeInCents === undefined) return '—'
    if (quote.deliveryFeeInCents) return formatPrice(quote.deliveryFeeInCents)
    return <span className='pedidos-free'><s>{formatPrice(vilafrancaZone.deliveryFeeInCents)}</s> {t({ es: 'Gratis', ca: 'Gratis', en: 'Free' })}</span>
}

const OrderSheet = ({ cartItems, subtotalInCents, customer, setCustomer, onChangeQuantity, onClear, onClose }) => {
    const [showErrors, setShowErrors] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const { type } = customer
    const quote = getDeliveryQuote({ type, postalCode: customer.postalCode, subtotalInCents })
    // On the delivery quote, so the "Entrega a domicilio" button shows it also while pickup is selected
    const deliveryQuote = getDeliveryQuote({ type: 'delivery', postalCode: customer.postalCode, subtotalInCents })
    const isFreeDelivery = deliveryQuote.status === 'ok' && !deliveryQuote.deliveryFeeInCents
    const errors = getErrors({ cartItems, customer, type, quote })
    const visibleErrors = showErrors ? errors : {}
    // The minimum already shows above the send button at all times
    const { minimum, ...alertErrors } = visibleErrors
    const deliveryInfo = getDeliveryInfo(type, quote)

    const updateField = (field) => (event) => setCustomer({ ...customer, [field]: event.target.value })
    const updatePostalCode = (event) => setCustomer({ ...customer, postalCode: event.target.value.replace(/\D/g, '').slice(0, 5) })

    const hasErrors = Object.keys(errors).length > 0

    const sendOrder = () => {
        if (hasErrors) {
            setShowErrors(true)
            return
        }
        const message = createOrderMessage({ cartItems, customer, type, quote, subtotalInCents })
        window.open(createWhatsappUrl(message), '_blank', 'noopener,noreferrer')
        setIsSent(true)
    }

    const startNewOrder = () => {
        onClear()
        setIsSent(false)
        setShowErrors(false)
    }

    return (
        <div className='pedidos-sheet-content'>
            <div className='pedidos-sheet-header'>
                <h2><span aria-hidden='true'>注文</span>{t({ es: 'Tu pedido', ca: 'La teva comanda', en: 'Your order' })}</h2>
                <button type='button' className='pedidos-sheet-close' onClick={onClose} aria-label={t({ es: 'Cerrar el pedido', ca: 'Tancar la comanda', en: 'Close the order' })}>×</button>
            </div>

            <div className='pedidos-sheet-body'>
                {!cartItems.length && (
                    <p className='pedidos-empty'>{t({ es: <>Todavía no has añadido platos. Pulsa <b>+</b> en los que quieras pedir.</>, ca: <>Encara no has afegit plats. Prem <b>+</b> als que vulguis demanar.</>, en: <>You haven't added any dishes yet. Press <b>+</b> on the ones you want to order.</> })}</p>
                )}
                {!!cartItems.length && (
                    <ul className='pedidos-cart-items'>
                        {cartItems.map(({ dish, quantity }) => (
                            <li key={dish.number}>
                                <div className='pedidos-cart-item-name'>
                                    <small className='pedidos-cart-item-number'>Nº {dish.number}</small>
                                    <span>{t(dish.name)}</span>
                                    <small>{formatPrice(dish.priceInCents)}</small>
                                </div>
                                <QuantityControl quantity={quantity} name={t(dish.name)} size='small' onChange={(change) => onChangeQuantity(dish.number, change)} />
                                <span className='pedidos-cart-item-total'>{formatPrice(dish.priceInCents * quantity)}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <h3 className='pedidos-sheet-title'>{t({ es: '¿Cómo lo quieres?', ca: 'Com la vols?', en: 'How do you want it?' })}</h3>
                <div className='pedidos-types' role='radiogroup' aria-label={t({ es: 'Tipo de pedido', ca: 'Tipus de comanda', en: 'Order type' })}>
                    <button type='button' role='radio' aria-checked={type === 'delivery'} className={type === 'delivery' ? 'selected' : ''} onClick={() => setCustomer({ ...customer, type: 'delivery' })}>
                        <span className='pedidos-type-icon delivery' aria-hidden='true' />
                        <strong>{t({ es: 'Entrega a domicilio', ca: 'Lliurament a domicili', en: 'Home delivery' })}</strong>
                        {isFreeDelivery
                            ? <small className='pedidos-free'>{t({ es: 'Tu pedido tiene envío gratis', ca: 'La teva comanda té enviament gratis', en: 'Your order has free delivery' })}</small>
                            : <small>{t({ es: <>Gratis en Vilafranca<br />desde {vilafrancaFreeFromText}<br />Fuera: mínimo {outsideMinimumText}</>, ca: <>Gratis a Vilafranca<br />des de {vilafrancaFreeFromText}<br />Fora: mínim {outsideMinimumText}</>, en: <>Free in Vilafranca<br />from {vilafrancaFreeFromText}<br />Outside: min. {outsideMinimumText}</> })}</small>}
                    </button>
                    <button type='button' role='radio' aria-checked={type === 'pickup'} className={type === 'pickup' ? 'selected' : ''} onClick={() => setCustomer({ ...customer, type: 'pickup' })}>
                        <span className='pedidos-type-icon pickup' aria-hidden='true' />
                        <strong>{t({ es: 'Recoger en el restaurante', ca: 'Recollir al restaurant', en: 'Pick up at the restaurant' })}</strong>
                        <small>{facts.street}</small>
                    </button>
                </div>

                <h3 className='pedidos-sheet-title'>{t({ es: 'Tus datos', ca: 'Les teves dades', en: 'Your details' })}</h3>
                <div className='pedidos-form'>
                    <NameAndPhoneFields className='pedidos-field' contact={customer} updateField={updateField} errors={visibleErrors} />
                    {type === 'delivery' && (
                        <>
                            <Field label={t({ es: 'Dirección', ca: 'Adreça', en: 'Address' })} value={customer.address} onChange={updateField('address')} autoComplete='street-address' placeholder={t({ es: 'Calle, número, piso', ca: 'Carrer, número, pis', en: 'Street, number, floor' })} error={visibleErrors.address} />
                            <Field label={t({ es: 'Código postal', ca: 'Codi postal', en: 'Postcode' })} value={customer.postalCode} onChange={updatePostalCode} inputMode='numeric' autoComplete='postal-code' placeholder='08720' error={visibleErrors.postalCode} />
                        </>
                    )}
                    <Field label={t({ es: 'Observaciones (opcional)', ca: 'Observacions (opcional)', en: 'Notes (optional)' })} value={customer.notes} onChange={updateField('notes')} isTextarea placeholder={t({ es: 'Alergias, sin picante, timbre...', ca: 'Al·lèrgies, sense picant, timbre...', en: 'Allergies, not spicy, doorbell...' })} />
                </div>
                {deliveryInfo && <p className={type === 'delivery' && isFreeDelivery ? 'pedidos-note free' : 'pedidos-note'}>{deliveryInfo}</p>}
            </div>

            <div className='pedidos-sheet-footer'>
                <dl className='pedidos-totals'>
                    <div><dt>Subtotal</dt><dd>{formatPrice(subtotalInCents)}</dd></div>
                    <div><dt>{t({ es: 'Gastos de envío', ca: "Despeses d'enviament", en: 'Delivery fee' })}</dt><dd>{getDeliveryFeeText(type, quote)}</dd></div>
                    <div className='pedidos-total'>
                        <dt>Total</dt>
                        <dd>{formatPrice(quote.totalInCents ?? subtotalInCents)}</dd>
                    </div>
                </dl>
                {errors.minimum && <p className='pedidos-warning'>{errors.minimum}</p>}
                <ErrorAlert className='pedidos-warning' title={t({ es: 'Para enviar el pedido:', ca: 'Per enviar la comanda:', en: 'To send the order:' })} errors={alertErrors} />
                <button type='button' className='pedidos-whatsapp' aria-disabled={hasErrors} onClick={sendOrder}>
                    <span className='pedidos-whatsapp-icon' aria-hidden='true' />
                    {t({ es: 'Enviar pedido por WhatsApp', ca: 'Enviar la comanda per WhatsApp', en: 'Send order by WhatsApp' })}
                </button>
                {isSent
                    ? (
                        <p className='pedidos-note sent'>
                            {t(
                                { es: <>Se ha abierto WhatsApp con tu pedido: pulsa <b>Enviar</b> allí. El restaurante te confirmará el pedido, el tiempo de entrega y el pago.</>, ca: <>S'ha obert WhatsApp amb la teva comanda: prem <b>Enviar</b> allà. El restaurant et confirmarà la comanda, el temps de lliurament i el pagament.</>, en: <>WhatsApp has opened with your order: press <b>Send</b> there. The restaurant will confirm the order, the delivery time and the payment.</> }
                            )}{' '}
                            <button type='button' className='pedidos-link' onClick={startNewOrder}>{t({ es: 'Empezar un pedido nuevo', ca: 'Començar una comanda nova', en: 'Start a new order' })}</button>
                        </p>
                    )
                    : (
                        <p className='pedidos-small'>
                            {t(
                                { es: 'Se abrirá WhatsApp con el pedido escrito. No se paga nada ahora: el pago se acuerda con el restaurante.', ca: "S'obrirà WhatsApp amb la comanda escrita. Ara no es paga res: el pagament s'acorda amb el restaurant.", en: 'WhatsApp will open with the order written. Nothing is paid now: payment is arranged with the restaurant.' }
                            )}
                        </p>
                    )}
            </div>
        </div>
    )
}

export default OrderSheet

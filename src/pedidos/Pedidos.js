import React, { useEffect, useMemo, useRef, useState } from 'react'
import Footer from '../Footer'
import PageHero from '../sections/PageHero'
import DishCard from './DishCard'
import OrderSheet from './OrderSheet'
import { updateQuantities } from './cart'
import { facts, formatPrice } from '../data/facts'
import { dishesByNumber, filterSections } from './takeawayMenu'
import { scrollToSection, useActiveSection } from './useSectionNav'
import { usePersistentState } from './usePersistentState'
import { t } from '../language'
import './pedidos.scss'

const emptyCustomer = { type: 'delivery', name: '', phone: '', address: '', postalCode: '', notes: '' }

// { 12: 2 } -> [{ dish, quantity: 2 }], in menu order; skips numbers no longer on the menu
const getCartItems = (quantities) => Object.entries(quantities)
    .map(([number, quantity]) => ({ dish: dishesByNumber[number], quantity }))
    .filter(({ dish, quantity }) => dish && quantity > 0)
    .sort((a, b) => a.dish.number - b.dish.number)

const Pedidos = () => {
    const [search, setSearch] = useState('')
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [quantities, setQuantities] = usePersistentState('pedidos-carrito', {})
    const [customer, setCustomer] = usePersistentState('pedidos-datos', emptyCustomer)
    const toolbarRef = useRef(null)
    const chipsRef = useRef(null)

    const sections = useMemo(() => filterSections(search), [search])
    const sectionIds = useMemo(() => sections.map((section) => section.id), [sections])
    const activeId = useActiveSection(sectionIds, toolbarRef, chipsRef)

    const cartItems = getCartItems(quantities)
    const subtotalInCents = cartItems.reduce((total, { dish, quantity }) => total + dish.priceInCents * quantity, 0)
    const dishesCount = cartItems.reduce((total, { quantity }) => total + quantity, 0)

    const changeQuantity = (number, change) => setQuantities((current) => updateQuantities(current, number, change))

    // Only the mobile sheet covers the page; on wide screens the order is a column beside the menu
    useEffect(() => {
        document.body.classList.toggle('pedidos-sheet-open', isSheetOpen)
        return () => document.body.classList.remove('pedidos-sheet-open')
    }, [isSheetOpen])

    return (
        <>
            <div className='pedidos'>
                <PageHero
                    kanji='外卖'
                    kicker={`${facts.name} · ${facts.town}`}
                    title={t({ es: <>Pide <em>online</em></>, ca: <>Demana <em>online</em></>, en: <>Order <em>online</em></> })}
                    isCompact
                >
                    <p className='lead'>
                        {t({
                            es: 'Elige tus platos de la carta para llevar y envíanos el pedido por WhatsApp.',
                            ca: "Tria els teus plats de la carta per emportar i envia'ns la comanda per WhatsApp.",
                            en: 'Choose your dishes from the takeaway menu and send us the order by WhatsApp.',
                        })}
                    </p>
                    <ol className='pedidos-steps'>
                        <li><span>一</span>{t({ es: 'Elige tus platos', ca: 'Tria els teus plats', en: 'Choose your dishes' })}</li>
                        <li><span>二</span>{t({ es: 'Pon tus datos', ca: 'Posa les teves dades', en: 'Enter your details' })}</li>
                        <li><span>三</span>{t({ es: 'Envíalo por WhatsApp', ca: 'Envia-la per WhatsApp', en: 'Send it by WhatsApp' })}</li>
                    </ol>
                </PageHero>

                <div className='pedidos-toolbar' ref={toolbarRef}>
                    <div className='pedidos-search'>
                        <input type='search' value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t({ es: 'Busca un plato o su número', ca: 'Busca un plat o el seu número', en: 'Search for a dish or its number' })} aria-label={t({ es: 'Buscar plato', ca: 'Buscar plat', en: 'Search dish' })} />
                    </div>
                    <nav className='pedidos-chips' ref={chipsRef} aria-label={t({ es: 'Secciones de la carta', ca: 'Seccions de la carta', en: 'Menu sections' })}>
                        {sections.map((section) => (
                            <button type='button' key={section.id} data-section={section.id} className={section.id === activeId ? 'selected' : ''} onClick={() => scrollToSection(section.id, toolbarRef)}>
                                {section.kanji && <span className='pedidos-chip-kanji' aria-hidden='true'>{section.kanji}</span>}
                                {section.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className='pedidos-layout'>
                    <main className='pedidos-menu'>
                        {!sections.length && <p className='pedidos-empty'>{t({ es: 'No hay platos que coincidan con', ca: 'No hi ha plats que coincideixin amb', en: 'No dishes match' })} «{search}».</p>}
                        {sections.map((section) => (
                            <section key={section.id} id={`seccion-${section.id}`} className='pedidos-section'>
                                <div className='pedidos-section-header'>
                                    {section.photoUrl && <img src={section.photoUrl} alt='' loading='lazy' />}
                                    {section.kanji && <b aria-hidden='true'>{section.kanji}</b>}
                                    <h2>{section.name}</h2>
                                    {section.note && <span>{section.note}</span>}
                                </div>
                                {/* A section without any photo (drinks) shows its dishes as text-only cards */}
                                <div className={section.dishes.some((dish) => dish.photoUrl) ? 'pedidos-dishes' : 'pedidos-dishes no-photos'}>
                                    {section.dishes.map((dish) => (
                                        <DishCard key={dish.number} dish={dish} quantity={quantities[dish.number] ?? 0} onChange={(change) => changeQuantity(dish.number, change)} />
                                    ))}
                                </div>
                            </section>
                        ))}
                        <p className='pedidos-small center'>{t({ es: 'Si tienes alguna alergia, indícalo en las observaciones del pedido.', ca: 'Si tens alguna al·lèrgia, indica-ho a les observacions de la comanda.', en: 'If you have any allergy, say so in the order notes.' })}</p>
                    </main>

                    <aside className={isSheetOpen ? 'pedidos-sheet open' : 'pedidos-sheet'} aria-label={t({ es: 'Tu pedido', ca: 'La teva comanda', en: 'Your order' })}>
                        <OrderSheet
                            cartItems={cartItems}
                            subtotalInCents={subtotalInCents}
                            customer={customer}
                            setCustomer={setCustomer}
                            onChangeQuantity={changeQuantity}
                            onClear={() => setQuantities({})}
                            onClose={() => setIsSheetOpen(false)}
                        />
                    </aside>
                    <div className={isSheetOpen ? 'pedidos-backdrop open' : 'pedidos-backdrop'} onClick={() => setIsSheetOpen(false)} />
                </div>

                {!isSheetOpen && (
                    <button type='button' className={dishesCount ? 'pedidos-cart-bar' : 'pedidos-cart-bar empty'} onClick={() => setIsSheetOpen(true)}>
                        <span className='pedidos-cart-count'>{dishesCount}</span>
                        <span>{dishesCount ? t({ es: 'Ver mi pedido', ca: 'Veure la meva comanda', en: 'See my order' }) : t({ es: 'Tu pedido está vacío', ca: 'La teva comanda és buida', en: 'Your order is empty' })}</span>
                        <span className='pedidos-cart-price'>{formatPrice(subtotalInCents)}</span>
                    </button>
                )}
            </div>
            <Footer />
        </>
    )
}

export default Pedidos

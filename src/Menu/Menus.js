import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Menu.scss'
import Dish from './Dish'
import menus from './MenusData'
import PageHero from '../sections/PageHero'
import MenusSection from '../sections/MenusSection'
import OrderSlip from '../sections/OrderSlip'
import Footer from '../Footer'
import { useReveal, revealDelay } from '../reveal/useReveal'
import { menuSections } from '../pedidos/takeawayMenu'
import { orderOnlineLabel, t } from '../language'
import allYouCanEatPhoto1 from '../images/menus/allyoucaneat1.webp'
import allYouCanEatPhoto2 from '../images/menus/allyoucaneat2.webp'
import allYouCanEatPhoto3 from '../images/menus/allyoucaneat3.webp'
import allYouCanEatPhoto4 from '../images/menus/allyoucaneat4.webp'
import blackRicePhoto from '../images/home/home2.webp'
import sushiPhoto from '../images/home/home3.webp'
import tempuraPhoto from '../images/home/home8.webp'
import beefPhoto from '../images/home/home14.webp'
import dessertsPhoto from '../images/menus/cartaDulces.webp'
import winesPhoto from '../images/menus/cartaVinos.webp'

const allYouCanEatPhotos = [allYouCanEatPhoto1, sushiPhoto, allYouCanEatPhoto2, blackRicePhoto, allYouCanEatPhoto3, tempuraPhoto, allYouCanEatPhoto4, beefPhoto]

const sides = [
    {
        kanji: '甜点',
        title: { es: 'Nuestros Dulces', ca: 'Els nostres Dolços', en: 'Our Desserts' },
        text: { es: 'Algo dulce para cerrar la comida.', ca: 'Alguna cosa dolça per tancar l’àpat.', en: 'Something sweet to round off the meal.' },
        photo: dessertsPhoto,
        // pdf: none yet, the old site's «Carta Dulces» button opened nothing
    },
    {
        kanji: '葡萄酒',
        title: { es: 'Nuestros Vinos', ca: 'Els nostres Vins', en: 'Our Wines' },
        text: { es: 'Una copa para acompañar tus platos.', ca: 'Una copa per acompanyar els teus plats.', en: 'A glass to go with your dishes.' },
        photo: winesPhoto,
        pdf: `${process.env.PUBLIC_URL}/menu-pdfs/CartaVinos2024v2_compressed.pdf`,
        button: { es: 'Carta Vinos', ca: 'Carta de Vins', en: 'Wine List' },
    },
]

const Menus = () => {
    const pageRef = useRef(null)
    const [sectionId, setSectionId] = useState(menuSections[0].id)
    useReveal(pageRef)

    const visibleSection = menuSections.find(({ id }) => id === sectionId)

    return (
        <div className='main-menu' ref={pageRef}>
            <PageHero
                kanji='菜单'
                title={t({
                    es: <>¡Prueba todos nuestros <em>platos y menús</em> ahora!</>,
                    ca: <>Prova ara tots els nostres <em>plats i menús</em>!</>,
                    en: <>Try all our <em>dishes and menus</em> now!</>,
                })}
            />
            <MenusSection />

            <section className='section section-dark'>
                <div className='centered' data-reveal='up'>
                    <p className='kicker'><em>配菜</em>Asia Oriental Taste</p>
                    <h2 className='heading'>{t({ es: <>Para <em>Acompañar</em></>, ca: <>Per <em>Acompanyar</em></>, en: <>On the <em>Side</em></> })}</h2>
                    <p className='lead sides-lead'>
                        {t({
                            es: 'Después de los platos, un postre; y durante la comida, una copa de nuestra carta de vinos.',
                            ca: 'Després dels plats, unes postres; i durant l’àpat, una copa de la nostra carta de vins.',
                            en: 'After the dishes, a dessert; and with the meal, a glass from our wine list.',
                        })}
                    </p>
                </div>
                <div className='sides-cards'>
                    {sides.map(({ kanji, title, text, photo, pdf, button }, index) => (
                        <article key={kanji} className='side-card' data-reveal='up' style={revealDelay(index, 0.15)}>
                            <div className='side-card-photo'>
                                <img src={photo} alt='' loading='lazy' />
                            </div>
                            <div>
                                <em aria-hidden='true'>{kanji}</em>
                                <h3>{t(title)}</h3>
                                <p>{t(text)}</p>
                                {pdf && <a className='cta cta-red' href={pdf} target='_blank' rel='noreferrer'>{t(button)}</a>}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className='all-you-can-eat section'>
                <div data-reveal='up'>
                    <p className='kicker'><em>放题</em>Asia Oriental Taste</p>
                    <h2 className='heading'>{t({ es: <>Todo lo que <em>puedas comer</em></>, ca: <>Tot el que <em>puguis menjar</em></>, en: <>All you <em>can eat</em></> })}</h2>
                    <p className='lead'>
                        {t({
                            es: 'Elige lo que quieras, saborea y disfruta todos nuestros deliciosos platos sin límites.',
                            ca: 'Tria el que vulguis, assaboreix i gaudeix de tots els nostres deliciosos plats sense límits.',
                            en: 'Choose whatever you like, savour and enjoy all our delicious dishes without limits.',
                        })}
                    </p>
                    <p className='lead'>
                        {t({
                            es: 'Empieza con unos dim sum, sigue con sushi y tempura y acaba con un ramen o un teppan yaki: pide lo que te apetezca, comparte en la mesa y atrévete con los platos que nunca has probado.',
                            ca: 'Comença amb uns dim sum, continua amb sushi i tempura i acaba amb un ramen o un teppan yaki: demana el que et vingui de gust, comparteix a taula i atreveix-te amb els plats que no has tastat mai.',
                            en: 'Start with some dim sum, move on to sushi and tempura and finish with a ramen or a teppan yaki: order whatever you fancy, share at the table and dare to try the dishes you have never had.',
                        })}
                    </p>
                </div>
                <div className='all-you-can-eat-strip'>
                    {allYouCanEatPhotos.map((photo, index) => (
                        <img key={photo} src={photo} alt='' loading='lazy' data-reveal='up' style={revealDelay(index, 0.08)} />
                    ))}
                </div>
            </section>

            <OrderSlip
                label='Asia Oriental Taste · 外卖'
                title={t({ es: 'Para llevar', ca: 'Per emportar', en: 'Takeaway' })}
                text={t({
                    es: 'Escoge entre los numerosos platos que tenemos disponibles para ti para poder ser disfrutados en el lugar que quieras',
                    ca: 'Tria entre els nombrosos plats que tenim disponibles per a tu per poder gaudir-los on vulguis',
                    en: 'Choose from the many dishes we have ready for you, to enjoy them wherever you like',
                })}
                pdfButton={t({ es: 'Ver Carta', ca: 'Veure Carta', en: 'See Menu' })}
            />

            <section id='platos' className='meals section section-dark'>
                <div className='centered' data-reveal='up'>
                    <p className='kicker'><em>菜</em></p>
                    <h2 className='heading'>{t({ es: <>Nuestros <em>Platos</em></>, ca: <>Els nostres <em>Plats</em></>, en: <>Our <em>Dishes</em></> })}</h2>
                </div>
                <div className='meals-tabs' data-reveal='up'>
                    {menuSections.map((section) => (
                        <button key={section.id} type='button' className={section.id === sectionId ? 'is-selected' : undefined} onClick={() => setSectionId(section.id)}>
                            <b aria-hidden='true'>{section.kanji}</b>
                            <span>{section.name}</span>
                        </button>
                    ))}
                </div>
                {visibleSection.note && <p className='meals-note'>{visibleSection.note}</p>}
                <div key={sectionId} className='meals-grid'>
                    {visibleSection.dishes.map((dish, index) => <Dish key={dish.number} dish={dish} index={index} />)}
                </div>
                <div className='cta-buttons'>
                    <a className='cta cta-red' href={menus.night.pdf} target='_blank' rel='noreferrer'>{t({ es: 'Ver Todo →', ca: 'Veure-ho Tot →', en: 'See All →' })}</a>
                    <Link className='cta cta-outline' to='/pedidos'>{t(orderOnlineLabel)}</Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Menus

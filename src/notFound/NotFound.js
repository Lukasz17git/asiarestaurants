import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer'
import { t } from '../language'

// Any URL without a page; Vercel serves it from build/404.html with a 404 status
const NotFound = () => (
    <>
        <section className='final-call'>
            <div className='final-call-content'>
                <p className='kicker'>404</p>
                <h1 className='heading'>{t({ es: <>Esta página <em>no existe</em></>, ca: <>Aquesta pàgina <em>no existeix</em></>, en: <>This page <em>doesn't exist</em></> })}</h1>
                <p className='lead'>{t({ es: 'Puede que el enlace esté mal escrito o que la página ya no esté. Nuestros platos siguen donde siempre.', ca: "Pot ser que l'enllaç estigui mal escrit o que la pàgina ja no hi sigui. Els nostres plats continuen on sempre.", en: 'The link may be misspelled or the page may be gone. Our dishes are still where they always were.' })}</p>
                <div className='cta-buttons'>
                    <Link className='cta cta-red' to='/'>{t({ es: 'Volver al inicio', ca: "Tornar a l'inici", en: 'Back to home' })}</Link>
                    <Link className='cta cta-outline' to='/menu'>{t({ es: 'Ver carta', ca: 'Veure la carta', en: 'See the menu' })}</Link>
                </div>
            </div>
        </section>
        <Footer />
    </>
)

export default NotFound

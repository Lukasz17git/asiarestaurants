import React from 'react'
import Footer from '../Footer'
import { t } from '../language'
import { facts, restaurant } from '../data/facts'
import './legal.scss'

const { legal } = restaurant
// Until restaurant.json has the company, the privacy text names the restaurant
const ownerName = legal.companyName || restaurant.name
const siteDomain = restaurant.siteUrl.replace('https://', '')
const emailLink = legal.email && <a href={`mailto:${legal.email}`}>{legal.email}</a>
const phoneLink = <a href={facts.phoneUrl}>{facts.phoneWithoutPrefix}</a>
const contactLinks = emailLink ? <>{phoneLink} / {emailLink}</> : phoneLink

// The owner's details Spanish law (LSSI) asks for; an empty one in restaurant.json is left out
const ownerRows = [
    [t({ es: 'Titular', ca: 'Titular', en: 'Owner' }), legal.companyName],
    ['CIF', legal.taxId],
    [t({ es: 'Domicilio social', ca: 'Domicili social', en: 'Registered office' }), legal.registeredAddress],
    [t({ es: 'Registro', ca: 'Registre', en: 'Registry' }), legal.registry],
    [t({ es: 'Restaurante', ca: 'Restaurant', en: 'Restaurant' }), facts.address],
    [t({ es: 'Teléfono', ca: 'Telèfon', en: 'Phone' }), phoneLink],
    ['Email', emailLink],
].filter(([, value]) => value)

const Legal = () => (
    <>
        <main className='legal'>
            <p className='kicker'><em>法</em>{restaurant.name}</p>
            <h1 className='heading'>{t({ es: 'Aviso legal y privacidad', ca: 'Avís legal i privacitat', en: 'Legal notice and privacy' })}</h1>

            <h2>{t({ es: 'Aviso legal', ca: 'Avís legal', en: 'Legal notice' })}</h2>
            <p>{t({ es: `${siteDomain} es la web de ${restaurant.name}. Su titular es:`, ca: `${siteDomain} és la web d'${restaurant.name}. El seu titular és:`, en: `${siteDomain} is the website of ${restaurant.name}. Its owner is:` })}</p>
            <dl className='legal-owner'>
                {ownerRows.map(([label, value]) => (
                    <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                    </div>
                ))}
            </dl>
            <p>{t({
                es: 'La web muestra la carta, los horarios y el local, y deja enviar pedidos y reservas por WhatsApp. Los precios incluyen IVA. Los textos, las fotos y el logo son del restaurante: no se pueden copiar sin su permiso.',
                ca: "La web mostra la carta, els horaris i el local, i deixa enviar comandes i reserves per WhatsApp. Els preus inclouen l'IVA. Els textos, les fotos i el logo són del restaurant: no es poden copiar sense el seu permís.",
                en: 'The website shows the menu, the opening hours and the restaurant, and lets you send orders and bookings by WhatsApp. Prices include VAT. The texts, photos and logo belong to the restaurant and may not be copied without its permission.',
            })}</p>

            <h2>{t({ es: 'Privacidad', ca: 'Privacitat', en: 'Privacy' })}</h2>
            <p>{t({
                es: <>Responsable de tus datos: <b>{ownerName}</b>. Cuando pides o reservas desde la web, escribes tu nombre, tu teléfono y, si es a domicilio, tu dirección. Esos datos solo nos llegan cuando envías tú el mensaje de WhatsApp.</>,
                ca: <>Responsable de les teves dades: <b>{ownerName}</b>. Quan demanes o reserves des de la web, escrius el teu nom, el teu telèfon i, si és a domicili, la teva adreça. Aquestes dades només ens arriben quan envies tu el missatge de WhatsApp.</>,
                en: <>Controller of your data: <b>{ownerName}</b>. When you order or book on the website, you write your name, your phone number and, for delivery, your address. They only reach us when you send the WhatsApp message yourself.</>,
            })}</p>
            <p>{t({
                es: 'Los usamos solo para preparar y entregar tu pedido o confirmar tu reserva, y para hablar contigo de ellos (base legal: cumplir lo que nos pides, art. 6.1.b del RGPD). Los guardamos el tiempo que haga falta para eso y lo que pidan las leyes, como las de facturación. No los vendemos ni los damos a nadie, salvo cuando lo exija la ley.',
                ca: 'Les fem servir només per preparar i lliurar la teva comanda o confirmar la teva reserva, i per parlar amb tu sobre això (base legal: complir el que ens demanes, art. 6.1.b del RGPD). Les guardem el temps que calgui per a això i el que demanin les lleis, com les de facturació. No les venem ni les donem a ningú, excepte quan ho exigeixi la llei.',
                en: 'We only use them to prepare and deliver your order or confirm your booking, and to contact you about it (legal basis: carrying out what you ask us, art. 6.1.b GDPR). We keep them as long as that takes and as long as the law requires, such as invoicing rules. We never sell or give them to anyone, unless the law requires it.',
            })}</p>
            <p>{t({
                es: 'Otras empresas que intervienen: WhatsApp (Meta) lleva los mensajes; Vercel aloja la web y guarda registros técnicos de las visitas, con la dirección IP, por seguridad; Google Fonts sirve las tipografías y recibe tu dirección IP; y GoatCounter cuenta las visitas sin cookies y sin guardar datos que te identifiquen.',
                ca: "Altres empreses que hi intervenen: WhatsApp (Meta) porta els missatges; Vercel allotja la web i guarda registres tècnics de les visites, amb l'adreça IP, per seguretat; Google Fonts serveix les tipografies i rep la teva adreça IP; i GoatCounter compta les visites sense galetes i sense guardar dades que t'identifiquin.",
                en: 'Other companies involved: WhatsApp (Meta) carries the messages; Vercel hosts the website and keeps technical logs of visits, with the IP address, for security; Google Fonts serves the fonts and receives your IP address; and GoatCounter counts visits without cookies and without keeping data that identifies you.',
            })}</p>
            <p>{t({
                es: <>Puedes pedirnos ver, corregir o borrar tus datos, oponerte a su uso, limitarlo o llevártelos, en el local o en el {contactLinks}. Si crees que no lo hemos hecho bien, puedes reclamar ante la Agencia Española de Protección de Datos (<a href='https://www.aepd.es' target='_blank' rel='noreferrer'>aepd.es</a>).</>,
                ca: <>Pots demanar-nos veure, corregir o esborrar les teves dades, oposar-te al seu ús, limitar-lo o endur-te-les, al local o al {contactLinks}. Si creus que no ho hem fet bé, pots reclamar davant l'Agència Espanyola de Protecció de Dades (<a href='https://www.aepd.es' target='_blank' rel='noreferrer'>aepd.es</a>).</>,
                en: <>You can ask us to see, correct or delete your data, object to or restrict its use, or take it with you, at the restaurant or on {contactLinks}. If you think we got it wrong, you can complain to the Spanish Data Protection Agency (<a href='https://www.aepd.es' target='_blank' rel='noreferrer'>aepd.es</a>).</>,
            })}</p>

            <h2>Cookies</h2>
            <p>{t({
                es: 'Esta web no usa cookies. Guarda en tu navegador (localStorage) el pedido que estás haciendo y tus datos de entrega, para no perderlos al recargar la página o al ir a WhatsApp; no salen de tu dispositivo hasta que envías el pedido, y puedes borrarlos desde los ajustes del navegador.',
                ca: "Aquesta web no fa servir galetes. Guarda al teu navegador (localStorage) la comanda que estàs fent i les teves dades de lliurament, per no perdre-les en recarregar la pàgina o en anar a WhatsApp; no surten del teu dispositiu fins que envies la comanda, i les pots esborrar des de la configuració del navegador.",
                en: "This website uses no cookies. It keeps the order you're making and your delivery details in your browser (localStorage), so they aren't lost when you reload the page or go to WhatsApp; they don't leave your device until you send the order, and you can delete them in your browser settings.",
            })}</p>

            <h2>{t({ es: 'Alérgenos', ca: 'Al·lèrgens', en: 'Allergens' })}</h2>
            <p>{t({
                es: <>Tenemos la información de los 14 alérgenos de cada plato (Reglamento UE 1169/2011). Pregúntanos en el local o al {phoneLink} antes de pedir.</>,
                ca: <>Tenim la informació dels 14 al·lèrgens de cada plat (Reglament UE 1169/2011). Pregunta'ns al local o al {phoneLink} abans de demanar.</>,
                en: <>We have the information on the 14 allergens of each dish (EU Regulation 1169/2011). Ask us at the restaurant or on {phoneLink} before ordering.</>,
            })}</p>

            <p className='legal-updated'>{t({ es: 'Actualizado en noviembre de 2026.', ca: 'Actualitzat el novembre de 2026.', en: 'Updated in November 2026.' })}</p>
        </main>
        <Footer />
    </>
)

export default Legal

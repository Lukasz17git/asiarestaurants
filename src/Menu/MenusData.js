import { facts } from '../data/facts'
import lunchPhoto from '../images/menus/allyoucaneat2.webp'
import dinnerPhoto from '../images/menus/allyoucaneat1.webp'
import takeawayPhoto from '../images/menus/takeAway.webp'

const pdfFolder = `${process.env.PUBLIC_URL}/menu-pdfs`

// backdropKanji: written down the card's right side; orderPage: a second button to order it online
const menus = {
    day: {
        name: { es: 'Menú Mediodía', ca: 'Menú Migdia', en: 'Lunch Menu' },
        description: { es: 'Nuestros menús del mediodía', ca: 'Els nostres menús del migdia', en: 'Our lunchtime menus' },
        time: { es: facts.lunchMenuHours },
        price: facts.lunchMenuPrice,
        backdropKanji: '昼食',
        photo: lunchPhoto,
        pdf: `${pdfFolder}/CartaDia2024_compressed.pdf`,
    },
    night: {
        name: { es: 'Menú Noche', ca: 'Menú Vespre', en: 'Dinner Menu' },
        description: { es: 'Nuestros menús nocturnos', ca: 'Els nostres menús del vespre', en: 'Our evening menus' },
        time: { es: facts.dinnerMenuHours },
        price: facts.dinnerMenuPrice,
        note: {
            es: `Viernes y festivos + ${facts.dinnerMenuExtra}`,
            ca: `Divendres i festius + ${facts.dinnerMenuExtra}`,
            en: `Fridays and holidays + ${facts.dinnerMenuExtra}`,
        },
        backdropKanji: '夕食',
        photo: dinnerPhoto,
        pdf: `${pdfFolder}/CartaNoche2024_compressed.pdf`,
    },
    pedidos: {
        name: { es: 'Carta Pedidos', ca: 'Carta Comandes', en: 'Takeaway Menu' },
        description: {
            es: 'Nuestros platos disponibles para poder ser llevados a tu casa o al sitio que prefieras',
            ca: 'Els nostres plats disponibles per poder ser portats a casa teva o al lloc que prefereixis',
            en: 'Our dishes available to be taken to your home or wherever you prefer',
        },
        time: { es: 'Para llevar', ca: 'Per emportar', en: 'Takeaway' },
        backdropKanji: '外卖',
        photo: takeawayPhoto,
        pdf: `${pdfFolder}/CartaLlevar2024_compressed.pdf`,
        orderPage: '/pedidos',
    },
}

export default menus

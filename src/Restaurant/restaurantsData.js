import { facts } from '../data/facts'
import vilafrancaPhoto from '../images/restaurants/asiaOrientalTaste.webp'
import reggioEmiliaPhoto from '../images/restaurants/asiaReggioEmilia.webp'
import ravennaPhoto from '../images/restaurants/asiaRavenna.webp'
import correggioPhoto from '../images/restaurants/asiaCorreggio.webp'

// In page order; id is each block's anchor (/restaurant#ravenna); hours only where restaurant.json has them
const restaurants = [
    {
        id: 'vilafranca',
        name: 'Asia Oriental Taste',
        town: 'Vilafranca del Penedès',
        country: 'spain',
        street: 'Vilafranca del Penedès, Carrer de la font, 4',
        phone: '+34 656181427',
        maps: 'https://maps.google.com/maps?q=Carrer%20de%20la%20Font,%204,%2008720%20Vilafranca%20del%20Pened%C3%A8s,%20Barcelona,%20Espa%C3%B1a&t=&z=13&ie=UTF8&iwloc=&output=embed',
        whatsapp: 'https://wa.me/34656181427',
        photo: vilafrancaPhoto,
        hours: facts.hoursText,
        description: {
            es: 'Precioso y delicioso restaurante asiático construido recientemente en España para que también puedas disfrutar de los platos culinarios más sabrosos y exquisitos del continente asiático. ¡Nuestra carta de más de 200 platos seguramente te sorprenderá!',
            ca: 'Preciós i deliciós restaurant asiàtic construït recentment a Espanya perquè també puguis gaudir dels plats culinaris més sabrosos i exquisits del continent asiàtic. La nostra carta de més de 200 plats segur que et sorprendrà!',
            en: 'A beautiful and delicious Asian restaurant, recently built in Spain so you can also enjoy the tastiest and finest dishes of the Asian continent. Our menu of more than 200 dishes is sure to surprise you!',
        },
    },
    {
        id: 'reggio-emilia',
        name: 'Asia Reggio Emilia',
        town: 'Reggio Emilia',
        country: 'italy',
        street: 'Via Augusto Piccard, 18',
        phone: '+39 0522304295',
        maps: 'https://maps.google.com/maps?q=ASIA%20Restaurant,%20Via%20Augusto%20Piccard,%20Reggio%20Emilia,%20Province%20of%20Reggio%20Emilia,%20Italy&t=&z=15&ie=UTF8&iwloc=&output=embed',
        whatsapp: 'https://wa.me/+393337037297',
        photo: reggioEmiliaPhoto,
        description: {
            es: 'Bellísimo restaurante en la ciudad de Reggio Emilia, altísimo detalle y un ambiente el cual fácilmente te hará sentir como si estuvieses en china. Te asombrarás con nuestra amplia variedad de platos, cada uno de ellos únicos y exquisitos.',
            ca: 'Bellíssim restaurant a la ciutat de Reggio Emilia, amb moltíssim detall i un ambient que fàcilment et farà sentir com si fossis a la Xina. T’astoraràs amb la nostra àmplia varietat de plats, cadascun únic i exquisit.',
            en: 'A stunning restaurant in the city of Reggio Emilia, with great attention to detail and an atmosphere that will easily make you feel as if you were in China. You will be amazed by our wide variety of dishes, each one unique and exquisite.',
        },
    },
    {
        id: 'ravenna',
        name: 'Asia Ravenna',
        town: 'Ravenna',
        country: 'italy',
        street: 'Via Faentina, 176',
        phone: '+39 05441580128',
        maps: 'https://maps.google.com/maps?q=Asia%20Restaurant,%20Via%20Faentina,%20Fornace%20Zarattini,%20Province%20of%20Ravenna,%20Italy&t=&z=15&ie=UTF8&iwloc=&output=embed',
        whatsapp: 'https://wa.me/+393311170575',
        photo: ravennaPhoto,
        description: {
            es: 'Original y apetitoso restaurante con los platos Orientales más exquisitos de la zona. Una vez que pises este restaurante no querrás volver a pisar ningún otro. Disponemos de una carta con más de 200 platos a degustar.',
            ca: 'Original i apetitós restaurant amb els plats orientals més exquisits de la zona. Un cop trepitgis aquest restaurant no en voldràs trepitjar cap altre. Tenim una carta amb més de 200 plats per tastar.',
            en: 'An original and appetising restaurant with the finest Oriental dishes in the area. Once you step into this restaurant you won’t want to go to any other. We have a menu with more than 200 dishes to taste.',
        },
    },
    {
        id: 'correggio',
        name: 'Asia Correggio',
        town: 'Correggio',
        country: 'italy',
        street: 'Viale della Repubblica, 33',
        phone: '+39 052269447',
        maps: 'https://maps.google.com/maps?q=ASIA%20Correggio%20-%20Oriental%20Taste,%20Viale%20Repubblica,%20Correggio,%20Province%20of%20Reggio%20Emilia,%20Italy&t=&z=15&ie=UTF8&iwloc=&output=embed',
        whatsapp: 'https://wa.me/+393688049548',
        photo: correggioPhoto,
        description: {
            es: 'Precioso y delicioso restaurante asiático situado en Italia para que puedas saborear nuestros mejores platos asiáticos. Contamos con una amplia variedad de los mejores onigiris, sashimi, tartare, chirashi, y mucho más.',
            ca: 'Preciós i deliciós restaurant asiàtic situat a Itàlia perquè puguis assaborir els nostres millors plats asiàtics. Tenim una àmplia varietat dels millors onigiris, sashimi, tàrtar, chirashi i molt més.',
            en: 'A beautiful and delicious Asian restaurant in Italy where you can savour our best Asian dishes. We have a wide variety of the best onigiri, sashimi, tartare, chirashi and much more.',
        },
    },
]

export default restaurants

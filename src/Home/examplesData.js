import uramakiPhoto from '../images/home/_uramaki.webp'
import goldenPhoto from '../images/home/_golden.webp'
import pokePhoto from '../images/home/_poke.webp'
import sambaPhoto from '../images/home/_samba.webp'

// The home's most popular dishes
const examples = [
    {
        name: 'Uramaki Asia',
        photo: uramakiPhoto,
        description: {
            es: 'Rollo de sushi con salmón cocido, aguacate, philadelphia y salmón picante.',
            ca: 'Rotlle de sushi amb salmó cuit, alvocat, philadelphia i salmó picant.',
            en: 'Sushi roll with cooked salmon, avocado, philadelphia and spicy salmon.',
        },
    },
    {
        name: 'Golden Lobster Roll',
        photo: goldenPhoto,
        description: {
            es: 'Uramaki Especial con langosta a temperatura ambiente, aguacate, trufa y hojas de oro comestibles.',
            ca: 'Uramaki Especial amb llagosta a temperatura ambient, alvocat, tòfona i fulles d’or comestibles.',
            en: 'Special Uramaki with lobster at room temperature, avocado, truffle and edible gold leaf.',
        },
    },
    {
        name: 'Poke Bowls Vegeta',
        photo: pokePhoto,
        description: {
            es: 'Edamame, Aguacate, Zanahorias, Mango y Pepinos.',
            ca: 'Edamame, Alvocat, Pastanagues, Mango i Cogombres.',
            en: 'Edamame, Avocado, Carrots, Mango and Cucumbers.',
        },
    },
    {
        name: 'Samba',
        photo: sambaPhoto,
        description: {
            es: 'Gunkan especial coronado con salmón, lima y alcohol flambeado.',
            ca: 'Gunkan especial coronat amb salmó, llima i alcohol flamejat.',
            en: 'Special gunkan topped with salmon, lime and flambéed alcohol.',
        },
    },
]

export default examples

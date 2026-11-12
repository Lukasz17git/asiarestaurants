import React from 'react'
import './sections.scss'

// The dishes the home's cuisine cards name
const dishes = [
    { name: 'Tempura', kanji: '天ぷら' },
    { name: 'Onigiri', kanji: 'おにぎり' },
    { name: 'Ramen', kanji: '拉面' },
    { name: 'Gua bao', kanji: '刈包' },
    { name: 'Giaozi', kanji: '饺子' },
    { name: 'Uramaki', kanji: '裏巻' },
    { name: 'Nigiri', kanji: '握り' },
]

const DishNames = () => dishes.map(({ name, kanji }) => <li key={name}>{name}<em>{kanji}</em></li>)

// A tilted red ribbon moving sideways; the list is written twice so the loop has no gap
const Marquee = () => {
    return (
        <div className='marquee'>
            <div className='marquee-track'>
                <ul><DishNames /></ul>
                <ul aria-hidden='true'><DishNames /></ul>
            </div>
        </div>
    )
}

export default Marquee

import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { orderOnlineLabel, t } from '../language'
import { getWeekdayShifts } from '../sections/reservation'
import logo from '../images/LogoRed.webp'
import sakuraPhoto from '../images/home/heroSakura.jpg'
import sushiPhoto from '../images/home/home3.webp'
import ramenPhoto from '../images/home/home9.webp'
import tempuraPhoto from '../images/home/home8.webp'
import dimSumPhoto from '../images/home/home12.webp'
import { getDishPhotoUrl } from '../data/dishPhotos'

// sunPhoto: another dish of the same kind, cut out, for the sun's quarter
const categories = [
    { name: 'Sushi', kanji: '寿司', photo: sushiPhoto, sunPhoto: getDishPhotoUrl('nigiri-sake') },
    { name: 'Ramen', kanji: '拉面', photo: ramenPhoto, sunPhoto: getDishPhotoUrl('ramen-beef') },
    { name: 'Tempura', kanji: '天ぷら', photo: tempuraPhoto, sunPhoto: getDishPhotoUrl('tempura-di-gamberi') },
    { name: 'Dim sum', kanji: '点心', photo: dimSumPhoto, sunPhoto: getDishPhotoUrl('guabao-anatra') },
]

// The home's four cuisine cards, around the sun: sushi by its quarter (top left), Japanese by the
// ramen (top right), Chinese by the dim sum (bottom left)
const orbitTags = [
    { kanji: '寿司', name: { es: 'Sushi', ca: 'Sushi', en: 'Sushi' } },
    { kanji: '和食', name: { es: 'Japonesa', ca: 'Japonesa', en: 'Japanese' } },
    { kanji: '中华', name: { es: 'China', ca: 'Xinesa', en: 'Chinese' } },
    { kanji: '外卖', name: { es: 'Domicilio', ca: 'Domicili', en: 'Delivery' } },
]

const shiftKanji = { lunch: '昼', dinner: '夜' }

const Front = () => {
    const shifts = getWeekdayShifts(new Date())

    return (
        <header className='front'>
            <div className='front-background'><img src={sakuraPhoto} alt='' /></div>
            <div className='front-content'>
                <p className='front-today'>
                    {shifts.map(({ key, time }, index) => (
                        <Fragment key={key}>
                            {index > 0 && <span className='front-today-slash' aria-hidden='true'>/</span>}
                            <span>{time}<em>{shiftKanji[key]}</em></span>
                        </Fragment>
                    ))}
                    {!shifts.length && <span>{t({ es: 'Hoy cerrado', ca: 'Avui tancat', en: 'Closed today' })}</span>}
                </p>
                <h1 className='front-title'>Asia <em>Oriental Taste</em></h1>
                <p className='front-lead'>
                    {t({
                        es: 'Una manera única de saborear Platos Orientales',
                        ca: 'Una manera única d’assaborir Plats Orientals',
                        en: 'A unique way to taste Oriental Dishes',
                    })}
                </p>
                <div className='cta-bar'>
                    <Link className='cta cta-red' to='/menu'>{t({ es: 'Menús →', ca: 'Menús →', en: 'Menus →' })}</Link>
                    <Link to='/pedidos'>{t(orderOnlineLabel)}</Link>
                    <Link to='/reservar'>{t({ es: 'Reservar', ca: 'Reservar', en: 'Book' })}</Link>
                </div>
                <div className='front-categories'>
                    {categories.map(({ name, kanji, photo }) => (
                        <Link key={name} to='/menu'>
                            <img src={photo} alt='' />
                            <em aria-hidden='true'>{kanji}</em>
                            <b>{name}</b>
                        </Link>
                    ))}
                </div>
            </div>
            <div className='front-sun' aria-hidden='true'>
                <span className='front-sun-ring' />
                <span className='front-sun-disc sun-disc' />
                <div className='front-sun-photos'>
                    {categories.map(({ name, sunPhoto }) => <span key={name}><img src={sunPhoto} alt='' /></span>)}
                </div>
                <span className='front-sun-logo sun-disc'><img src={logo} alt='' /></span>
                {orbitTags.map(({ kanji, name }) => (
                    <b key={kanji} className='front-orbit'><em>{kanji}</em>{t(name)}</b>
                ))}
                <span className='front-seal stamp'>亚洲</span>
            </div>
        </header>
    )
}

export default Front

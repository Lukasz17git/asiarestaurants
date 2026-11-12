import React, { Fragment, useRef, useState } from 'react'
import Footer from '../Footer'
import PageHero from '../sections/PageHero'
import tablePhoto from '../images/menus/allyoucaneat3.webp'
import { useReveal } from '../reveal/useReveal'
import { createReservationUrl, getNextDays, getShiftsOn, isBookableSlot, isPastSlot, toDateValue } from '../sections/reservation'
import { t } from '../language'
import './reservar.scss'
import { facts } from '../data/facts'
import { ErrorAlert, NameAndPhoneFields, getNameAndPhoneErrors, keepFailedFields } from '../sections/contactForm'

// The value goes as is in the WhatsApp message, always in Spanish
const moreThanSix = 'Más de 6'
const peopleOptions = ['1', '2', '3', '4', '5', '6', moreThanSix]
const getPeopleLabel = (people) => (people === moreThanSix ? t({ es: moreThanSix, ca: 'Més de 6', en: 'More than 6' }) : people)

const locale = t({ es: 'es-ES', ca: 'ca-ES', en: 'en-GB' })
const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' })
const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long' })

const getDayLabel = (date, index) => t({ es: ['Hoy', 'Mañana'], ca: ['Avui', 'Demà'], en: ['Today', 'Tomorrow'] })[index] || weekdayFormat.format(date).replace('.', '')

const closedText = t({ es: 'Ese día no abrimos.', ca: 'Aquest dia no obrim.', en: "We're closed that day." })

const getErrors = ({ people, date, time, name, phone }) => {
    const isClosedDay = date && !getShiftsOn(date).length
    const errors = {
        people: !people && t({ es: 'Elige cuántos sois.', ca: 'Tria quants sou.', en: 'Choose how many you are.' }),
        date: ((!date || date < toDateValue(new Date())) && t({ es: 'Elige el día.', ca: 'Tria el dia.', en: 'Choose the day.' })) || (isClosedDay && closedText),
        time: (!time || (date && !isBookableSlot(date, time))) && t({ es: 'Elige la hora.', ca: "Tria l'hora.", en: 'Choose the time.' }),
        ...getNameAndPhoneErrors({ name, phone }),
    }
    return keepFailedFields(errors)
}

const Question = ({ kanji, text, children }) => (
    <div className='reservar-group'>
        <p className='reservar-label'><i>{kanji}</i>{text}</p>
        {children}
    </div>
)

const Chip = ({ isOn, className = 'reservar-chip', ...buttonProps }) => (
    <button type='button' className={isOn ? `${className} is-on` : className} aria-pressed={isOn} {...buttonProps} />
)

// «Reservar» page: a booking form that sends the reservation written in a WhatsApp message
const Reservar = () => {
    const [booking, setBooking] = useState({ people: '', date: '', time: '', name: '', phone: '' })
    const [isOtherDay, setIsOtherDay] = useState(false)
    const [showErrors, setShowErrors] = useState(false)
    const otherDayRef = useRef(null)
    const pageRef = useRef(null)
    useReveal(pageRef)

    const days = getNextDays(6)
    const today = toDateValue(days[0])
    const months = [...new Set(days.map((date) => monthFormat.format(date)))].join(' – ')
    // Before a day is picked, today's hours
    const shifts = getShiftsOn(booking.date || today)
    const errors = getErrors(booking)
    const visibleErrors = showErrors ? errors : {}

    const update = (changes) => setBooking((current) => ({ ...current, ...changes }))
    // A time the new day doesn't have, or that already went, is dropped
    const pickDate = (date) => update({ date, time: booking.time && isBookableSlot(date, booking.time) ? booking.time : '' })
    const pickNextDay = (date) => {
        setIsOtherDay(false)
        pickDate(date)
    }
    const pickOtherDay = () => {
        setIsOtherDay(true)
        update({ date: '' })
        setTimeout(() => otherDayRef.current?.showPicker?.())
    }
    const updateField = (field) => (event) => update({ [field]: event.target.value })

    const send = (event) => {
        event.preventDefault()
        setShowErrors(true)
        if (Object.keys(errors).length) return
        window.open(createReservationUrl(booking), '_blank', 'noopener,noreferrer')
    }

    return (
        <div ref={pageRef}>
            <PageHero
                kanji='予約'
                kicker={t({ es: 'Mediodía y noche', ca: 'Migdia i vespre', en: 'Lunch and dinner' })}
                title={t({ es: <>Reserva tu <em>mesa</em></>, ca: <>Reserva la teva <em>taula</em></>, en: <>Book your <em>table</em></> })}
                isCompact
            />
            <section className='reservar'>
                <form className='reservar-sheet' onSubmit={send} noValidate data-reveal='zoom'>
                    <div className='reservar-form'>
                        <Question kanji='一' text={t({ es: '¿Cuántos sois?', ca: 'Quants sou?', en: 'How many are you?' })}>
                            <div className='reservar-row'>
                                {peopleOptions.map((people) => (
                                    <Chip key={people} isOn={booking.people === people} onClick={() => update({ people })}>{getPeopleLabel(people)}</Chip>
                                ))}
                            </div>
                        </Question>
                        <Question kanji='二' text={t({ es: '¿Qué día?', ca: 'Quin dia?', en: 'Which day?' })}>
                            <p className='reservar-month'>{months}</p>
                            <div className='reservar-row'>
                                {days.map((date, index) => {
                                    const dateValue = toDateValue(date)
                                    return (
                                        <Chip key={dateValue} className='reservar-day' isOn={!isOtherDay && booking.date === dateValue} disabled={!getShiftsOn(dateValue).length} onClick={() => pickNextDay(dateValue)}>
                                            <small>{getDayLabel(date, index)}</small>
                                            <b>{date.getDate()}</b>
                                        </Chip>
                                    )
                                })}
                                <Chip className='reservar-day reservar-other-day' isOn={isOtherDay} onClick={pickOtherDay}>
                                    <small>{t({ es: 'Otro día', ca: 'Un altre dia', en: 'Another day' })}</small>
                                    <b>{isOtherDay && booking.date ? Number(booking.date.slice(-2)) : '📅'}</b>
                                </Chip>
                            </div>
                            {isOtherDay && (
                                <input ref={otherDayRef} className='reservar-date' type='date' min={today} value={booking.date} onChange={(event) => pickDate(event.target.value)} aria-label={t({ es: 'Otro día', ca: 'Un altre dia', en: 'Another day' })} />
                            )}
                        </Question>
                        <Question kanji='三' text={t({ es: '¿A qué hora?', ca: 'A quina hora?', en: 'What time?' })}>
                            {!shifts.length && <p className='reservar-closed'>{closedText}</p>}
                            {shifts.map(({ name, slots }) => (
                                <div key={name} className='reservar-slots'>
                                    <span>{name}</span>
                                    <div className='reservar-row'>
                                        {slots.map((slot) => (
                                            <Chip key={slot} isOn={booking.time === slot} disabled={isPastSlot(booking.date, slot)} onClick={() => update({ time: slot })}>{slot}</Chip>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Question>
                        <Question kanji='四' text={t({ es: '¿A nombre de quién?', ca: 'A nom de qui?', en: 'In whose name?' })}>
                            <div className='reservar-fields'>
                                <NameAndPhoneFields className='reservar-field' contact={booking} updateField={updateField} errors={visibleErrors} />
                            </div>
                        </Question>
                    </div>
                    <div className='reservar-info'>
                        <figure className='reservar-photo'>
                            <img src={tablePhoto} alt={t({ es: 'Mesa con platos para compartir', ca: 'Taula amb plats per compartir', en: 'Table with dishes to share' })} loading='lazy' />
                            <figcaption>{facts.name} · {facts.town}</figcaption>
                        </figure>
                        <div className='reservar-hours'>
                            <b className='reservar-mini'>{t({ es: 'Horario', ca: 'Horari', en: 'Opening hours' })}</b>
                            {facts.schedule.map(({ days, shifts: dayShifts }) => (
                                <Fragment key={days}>
                                    <p>{days}</p>
                                    {dayShifts.map(({ name, time }) => (
                                        <div key={name} className='reservar-hours-row'><span>{name}</span><b>{time}</b></div>
                                    ))}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div className='reservar-send'>
                        <button type='submit' className='cta cta-red'>
                            <span className='reservar-whatsapp-icon' aria-hidden='true' />
                            {t({ es: 'Enviar por WhatsApp', ca: 'Enviar per WhatsApp', en: 'Send by WhatsApp' })}
                        </button>
                        <ErrorAlert className='reservar-warning' title={t({ es: 'Para reservar:', ca: 'Per reservar:', en: 'To book:' })} errors={visibleErrors} />
                        <p className='reservar-note'>
                            {t({ es: 'Te contestamos por WhatsApp para confirmar la mesa. ¿Más de 6 o para hoy mismo? Llámanos al', ca: "Et contestem per WhatsApp per confirmar la taula. Més de 6 o per avui mateix? Truca'ns al", en: 'We reply by WhatsApp to confirm the table. More than 6 or for today? Call us on' })} <a href={facts.phoneUrl}>{facts.phoneWithoutPrefix}</a>.
                        </p>
                    </div>
                </form>
            </section>
            <Footer />
        </div>
    )
}

export default Reservar

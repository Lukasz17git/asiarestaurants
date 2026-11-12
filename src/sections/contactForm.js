import React from 'react'
import { t } from '../language'

// Label, input (or textarea) and its error; each form styles it through its own className
export const FormField = ({ className, label, error, isTextarea, ...inputProps }) => (
    <label className={error ? `${className} invalid` : className}>
        <span>{label}</span>
        {isTextarea ? <textarea rows={3} aria-invalid={Boolean(error)} {...inputProps} /> : <input aria-invalid={Boolean(error)} {...inputProps} />}
        {error && <small>{error}</small>}
    </label>
)

export const NameAndPhoneFields = ({ className, contact, updateField, errors }) => (
    <>
        <FormField className={className} label={t({ es: 'Nombre', ca: 'Nom', en: 'Name' })} value={contact.name} onChange={updateField('name')} autoComplete='name' error={errors.name} />
        <FormField className={className} label={t({ es: 'Teléfono', ca: 'Telèfon', en: 'Phone' })} value={contact.phone} onChange={updateField('phone')} type='tel' inputMode='tel' autoComplete='tel' error={errors.phone} />
    </>
)

// Field -> message (`false` when it's fine); the phone needs 9+ digits, spaces aside ('656 18 14 27')
export const getNameAndPhoneErrors = ({ name, phone }) => {
    const phoneDigits = phone.replace(/\D/g, '')
    return {
        name: !name.trim() && t({ es: 'Escribe tu nombre.', ca: 'Escriu el teu nom.', en: 'Enter your name.' }),
        phone: (!phoneDigits && t({ es: 'Escribe tu teléfono.', ca: 'Escriu el teu telèfon.', en: 'Enter your phone number.' })) || (phoneDigits.length < 9 && t({ es: 'El teléfono tiene que tener al menos 9 números.', ca: 'El telèfon ha de tenir almenys 9 números.', en: 'The phone number must have at least 9 digits.' })),
    }
}

// Keeps only the fields with a message
export const keepFailedFields = (errors) => Object.fromEntries(Object.entries(errors).filter(([, error]) => error))

// Every message in one line after the title; nothing when there are none
export const ErrorAlert = ({ className, title, errors }) => {
    const messages = Object.values(errors)
    return messages.length ? <p className={className} role='alert'>{title} {messages.join(' ')}</p> : null
}

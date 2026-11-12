import React from 'react'
import OrderSlip from '../sections/OrderSlip'
import { t } from '../language'

// Asia Delivery
const Section2 = () => (
  <OrderSlip
    label='Asia Delivery · 外卖'
    title={t({ es: 'Pide a Domicilio', ca: 'Demana a Domicili', en: 'Order for Delivery' })}
    text={t({
      es: '¡Pide a casa y recibe además promociones adicionales!',
      ca: 'Demana a casa i rep, a més, promocions addicionals!',
      en: 'Order to your home and get extra promotions too!',
    })}
    pdfButton={t({ es: '¡Ver carta!', ca: 'Veure carta!', en: 'See menu!' })}
  />
)

export default Section2

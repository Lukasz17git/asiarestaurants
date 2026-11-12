import { fillFacts, formatPrice, getFacts, restaurant } from './restaurantFacts'
import { language } from '../language'

// The restaurant's data in the page's language: facts.hoursText, facts.phone, facts.dishCount... To change one, edit restaurant.json
export const facts = getFacts(language)

// 'Abierto {openingText}' -> the text with each {name} replaced by its fact; also every text of an object
export const fillPageFacts = (texts) => fillFacts(texts, language)

export { formatPrice, restaurant }

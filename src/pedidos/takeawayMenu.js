// Copy of public/dishes/dishes.json, made by scripts/copy-dishes-to-src.js before every start and build
import sections from './dishes.copy.json'
import { t } from '../language'
import { getDishPhotoUrl } from '../data/dishPhotos'

// 'Salmón' and 'salmon' find the same dishes
const normalizeSearch = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// 'Ramen y Sopas' -> 'ramen-y-sopas'
const toSlug = (text) => normalizeSearch(text).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Hides a description that only repeats the name ('Empanadillas de carne')
const getDescription = (dish) => {
    const description = t(dish.description)?.trim()
    return description && description.toLowerCase() !== t(dish.name).trim().toLowerCase() ? description : ''
}

// id comes from the Spanish name, so it's the same in every language ('ramen-y-sopas')
export const menuSections = sections.map((section) => ({
    id: toSlug(section.name.es),
    name: t(section.name),
    kanji: section.kanji ?? '',
    note: t(section.note) ?? '',
    photoUrl: getDishPhotoUrl(section.photo),
    dishes: section.dishes.map((dish) => ({ ...dish, description: getDescription(dish), photoUrl: getDishPhotoUrl(dish.photo) })),
}))

export const dishesByNumber = Object.fromEntries(menuSections.flatMap((section) => section.dishes).map((dish) => [dish.number, dish]))

export const filterSections = (search) => {
    const normalizedSearch = normalizeSearch(search)
    if (!normalizedSearch) return menuSections
    return menuSections
        .map((section) => ({
            ...section,
            dishes: section.dishes.filter((dish) => normalizeSearch(`${dish.number} ${t(dish.name)} ${dish.description} ${section.name}`).includes(normalizedSearch)),
        }))
        .filter((section) => section.dishes.length)
}

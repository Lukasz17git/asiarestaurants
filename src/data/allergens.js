// The 14 allergens EU law (Regulation 1169/2011) asks restaurants to show. A dish of public/dishes/dishes.json
// lists its own by these keys ("allergens": ["gluten", "soy"]); scripts/write-page-heads.js stops the build on any other.
// CommonJS: the app imports it and so does that script, which Node runs
const allergenNames = {
    gluten: { es: 'Gluten', ca: 'Gluten', en: 'Gluten' },
    crustaceans: { es: 'Crustáceos', ca: 'Crustacis', en: 'Crustaceans' },
    eggs: { es: 'Huevo', ca: 'Ou', en: 'Egg' },
    fish: { es: 'Pescado', ca: 'Peix', en: 'Fish' },
    peanuts: { es: 'Cacahuetes', ca: 'Cacauets', en: 'Peanuts' },
    soy: { es: 'Soja', ca: 'Soja', en: 'Soy' },
    milk: { es: 'Leche', ca: 'Llet', en: 'Milk' },
    nuts: { es: 'Frutos de cáscara', ca: 'Fruits de closca', en: 'Tree nuts' },
    celery: { es: 'Apio', ca: 'Api', en: 'Celery' },
    mustard: { es: 'Mostaza', ca: 'Mostassa', en: 'Mustard' },
    sesame: { es: 'Sésamo', ca: 'Sèsam', en: 'Sesame' },
    sulphites: { es: 'Sulfitos', ca: 'Sulfits', en: 'Sulphites' },
    lupin: { es: 'Altramuces', ca: 'Tramussos', en: 'Lupin' },
    molluscs: { es: 'Moluscos', ca: 'Mol·luscs', en: 'Molluscs' },
}

module.exports = { allergenNames }

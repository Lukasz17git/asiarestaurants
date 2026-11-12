// Create React App can't import from public/, so the app imports this copy of the dishes.
// dishes.json calls Catalan 'cat' (the PDF menu maker reads it so); the app and its URLs call it 'ca'
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const dishSections = JSON.parse(fs.readFileSync(path.join(root, 'public/dishes/dishes.json'), 'utf8'), (key, value) => {
    if (!value || typeof value !== 'object' || !('cat' in value)) return value
    const { cat, ...texts } = value
    return { ...texts, ca: cat }
})
fs.writeFileSync(path.join(root, 'src/pedidos/dishes.copy.json'), JSON.stringify(dishSections))

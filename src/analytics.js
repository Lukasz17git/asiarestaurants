// GoatCounter (script in public/index.html) counts visits without cookies at https://asiarestaurants.goatcounter.com;
// the script counts the landing page and skips localhost

// A page opened after the landing page, inside the app
export const countPage = (path) => window.goatcounter?.count?.({ path })

// An action instead of a page, listed by its name under «Events» in GoatCounter
export const countEvent = (name) => window.goatcounter?.count?.({ path: name, title: name, event: true })

// The first link start found wins, so the Facebook share link goes before the profile's
const eventNamesByLinkStart = [
    ['tel:', 'call'],
    ['https://wa.me/', 'whatsapp-chat'],
    ['https://api.whatsapp.com/send', 'share-whatsapp'],
    ['https://www.instagram.com/', 'instagram'],
    ['https://www.facebook.com/sharer/', 'share-facebook'],
    ['https://www.facebook.com/', 'facebook'],
]

// One listener on the document, so links added later are counted too
export const countTrackedLinkClicks = () => document.addEventListener('click', (event) => {
    const href = event.target.closest?.('a[href]')?.getAttribute('href') ?? ''
    const eventName = eventNamesByLinkStart.find(([linkStart]) => href.startsWith(linkStart))?.[1]
    if (eventName) countEvent(eventName)
})

import React from 'react'
import './sections.scss'

// The top of every page but the home: the title on the left over its kanji, faded large on the right.
// aside: shown on the right instead (/restaurant's four restaurants); isCompact: less space below
const PageHero = ({ kanji, kicker, title, aside, isCompact, children }) => {
    const classNames = ['page-hero', aside && 'page-hero-with-aside', isCompact && 'page-hero-compact'].filter(Boolean).join(' ')

    return (
        <header className={classNames}>
            {!aside && <span className='page-hero-kanji' aria-hidden='true'>{kanji}</span>}
            <div className='page-hero-content'>
                <p className='kicker'><em>{kanji}</em>{kicker}</p>
                <h1 className='heading'>{title}</h1>
                {children}
            </div>
            {aside}
        </header>
    )
}

export default PageHero

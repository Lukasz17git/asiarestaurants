import React, { useRef } from 'react'
import '../css/Home.scss'
import Front from './Front'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import Marquee from '../sections/Marquee'
import MenusSection from '../sections/MenusSection'
import RestaurantCard from '../sections/RestaurantCard'
import restaurants from '../Restaurant/restaurantsData'
import Footer from '../Footer'
import { useReveal } from '../reveal/useReveal'

const vilafranca = restaurants.find(({ id }) => id === 'vilafranca')

const Home = () => {
  const homeRef = useRef(null)
  useReveal(homeRef)

  return (
    <div className='home' ref={homeRef}>
      <Front />
      <Marquee />
      <Section1 />
      <Section3 />
      <Section4 />
      <MenusSection />
      <Section2 />
      <section className='section'>
        <RestaurantCard restaurant={vilafranca} />
      </section>
      <Footer />
    </div>
  )
}

export default Home

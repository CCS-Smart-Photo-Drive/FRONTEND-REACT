import React from 'react'
import AboutSection from './AboutSection'
import Contributor from './Contributor'
import ExecutiveBoard from './ExecutiveBoard'
import Header from './Header'
import Footer from './Footer'

function About_Page() {

  return (
    <>
    <div>
      <Header/>
      <AboutSection/> 
      <Contributor/>
      <ExecutiveBoard/>
      <Footer/>
    </div>
    </>
  )
}

export default About_Page

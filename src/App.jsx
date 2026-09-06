import {
  Header,
  Hero,
  About,
  Services,
  Work,
  Philosophy,
  Contact,
  Footer,
} from './components/sections'

const App = () => {
  return (
    // <header> and <footer> nested inside <main> are scoped to the main region,
    // so neither was exposed as a banner / contentinfo landmark. id="top" gives
    // href="#top" (the footer's back-to-top and the Logo anchor) a real target
    // instead of a bare hash.
    <div id="top" className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Work />
        <Philosophy />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App

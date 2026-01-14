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
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <About />
      <Services />
      <Work />
      <Philosophy />
      <Contact />
      <Footer />
    </main>
  )
}

export default App

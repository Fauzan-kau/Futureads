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
    //
    // Two rules this div now carries, because Header.jsx is position: sticky
    // and THIS element is its containing block:
    //   1. Never put overflow-hidden / overflow-x-hidden / overflow-y-auto on
    //      this div, on #root, or on body. Any overflow other than visible or
    //      clip makes that ancestor a scroll container; the header then sticks
    //      to a scrollport that never scrolls and rides away with the page,
    //      silently — no error, no devtools badge, it just presents as "the
    //      header stopped being fixed". Note overflow-x: hidden computes
    //      overflow-y to auto, so the reflexive fix for a stray horizontal
    //      scrollbar is exactly the edit that breaks this. Use overflow-x-clip
    //      instead; clip creates no scroll container. Philosophy.jsx:30 already
    //      does that, and globals.css ships an .overflow-x-hidden utility that
    //      must never land here.
    //   2. <Header /> stays a DIRECT CHILD here, never inside <main>. A sticky
    //      element pins only within its containing block, so a header inside
    //      <main> would come unstuck the moment the Footer scrolled into view —
    //      it would slide up and off, looking a lot like the bug this replaced.
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

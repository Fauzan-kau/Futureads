import { Container, Section } from '../layout'
import { Heading, Text, Button } from '../ui'
import { CountUp, FadeIn } from '../animation'

const Hero = () => {
  return (
    // The header is sticky, so it sits IN FLOW above this section and eats the
    // top of the first screen. A bare 100svh would therefore run one viewport
    // PLUS the bar and the hero would no longer end at the fold. 4rem / 5rem
    // mirror Header.jsx's h-16 md:h-20 and the 1px is its border-b — 61 / 65 /
    // 81px at the three bands. rem on both sides is the point: they shrink
    // together at the 15px root globals.css sets below 640px. If the header's
    // row height ever changes, this changes with it.
    // svh, not vh: the SMALL viewport is the one that is never clipped by
    // mobile browser chrome. Same unit and same reason as globals.css's
    // .inq-layer.
    <Section padding="none" className="min-h-[calc(100svh_-_4rem_-_1px)] md:min-h-[calc(100svh_-_5rem_-_1px)] flex items-center relative overflow-hidden">
      {/* Decorative elements - hidden on small screens */}
      <div className="hidden md:block absolute top-20 right-0 w-64 lg:w-96 h-64 lg:h-96 border border-gray-100 rounded-full opacity-50" />
      <div className="hidden md:block absolute bottom-20 left-10 w-32 lg:w-64 h-32 lg:h-64 border border-gray-200 rounded-full opacity-30" />
      <div className="hidden sm:block absolute top-1/2 right-1/4 w-2 h-2 bg-black rounded-full" />
      <div className="hidden sm:block absolute top-1/3 right-1/3 w-1 h-1 bg-gray-400 rounded-full" />

      {/* py-20 md:py-24 is now ordinary design padding and free to retune. It
          used to be the de facto header clearance — the header was fixed with
          nothing reserving its height, so this padding was the only thing
          keeping the eyebrow out from under the bar, with nothing saying so.
          The sticky header reserves its own height now, so that job is gone. */}
      <Container className="py-20 md:py-24 relative z-10">
        <div className="max-w-5xl">
          <FadeIn delay={0}>
            <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-5">
              Creative Advertising Agency
            </Text>
          </FadeIn>

          <FadeIn delay={100}>
            {/* The marker-sweep that used to invert "future" is gone, and with
                it the .highlight-wipe keyframes in globals.css — the emphasis
                is now carried by the case change alone, which needs no
                duplicated word, no aria-hidden copy under a black bar and no
                animation to arrive before the line reads correctly.
                tracking is set on the fontSize token (text-display), so the
                uppercase run gets no tracking-* utility here: a utility would
                override the token for the whole heading. */}
            <Heading as="h1" size="display" className="mb-6">
              Give your brand
              <span className="block">a FUTURE</span>
            </Heading>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="w-24 h-px bg-black mb-7" />
          </FadeIn>

          <FadeIn delay={300}>
            <Text size="large" color="muted" className="max-w-xl mb-8">
              We craft bold, impactful campaigns that transform how audiences
              perceive and connect with your brand. Strategy meets creativity.
            </Text>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-wrap gap-4">
              <Button href="#work" variant="primary" size="large">
                View Our Work
              </Button>
              <Button href="#contact" variant="secondary" size="large">
                Get in Touch
              </Button>
            </div>
          </FadeIn>

          {/* The figures count up rather than sitting there. delay 600 is this
              FadeIn's own 500 plus one rung of the ladder above, so the count
              starts 100ms INTO the row's fade, not after it — the row is at
              ~28% opacity then, dim enough that "0+" is not read as a claim.
              Both clocks are IntersectionObservers on the same subtree and the
              spec delivers every pending observation in one step at the end of
              the same frame, so they start together rather than approximately.
              600 + CountUp's 700 lands the settle on 1300ms, the same frame the
              scroll indicator below finishes arriving: one settle for the hero,
              not two.
              One shared delay on purpose. The three stats are one statement
              divided by hairlines, not a list like Work or Services, so they
              move in lockstep — the easing alone already lands them ~1056 /
              1230 / 1253ms, which is all the stagger a spec row wants.
              grid-cols-3 is repeat(3, minmax(0, 1fr)) — a ZERO minimum — so
              widening digits can never pull a track and the border-l dividers
              hold still no matter what the numbers do. */}
          <FadeIn delay={500}>
            <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-8 lg:gap-10">
              <div className="text-center md:text-left">
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Projects
                </Text>
                <Heading as="span" size="title" weight="bold">
                  <CountUp to={50} suffix="+" delay={600} />
                </Heading>
              </div>
              <div className="text-center md:text-left border-l border-gray-200 pl-4 md:pl-8">
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Clients
                </Text>
                <Heading as="span" size="title" weight="bold">
                  <CountUp to={25} suffix="+" delay={600} />
                </Heading>
              </div>
              <div className="text-center md:text-left border-l border-gray-200 pl-4 md:pl-8">
                <Text size="caption" color="light" className="uppercase tracking-wider mb-1">
                  Years
                </Text>
                <Heading as="span" size="title" weight="bold">
                  <CountUp to={3} suffix="+" delay={600} />
                </Heading>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Scroll indicator - hidden on mobile, and wordless: the rule alone says
          "there is more below" without labelling the gesture. The absolute
          positioning still has to live on a plain wrapper even now that there
          is a single child: FadeIn always writes an inline transform, so IT
          would become the containing block and park this at the right edge of
          the hero's flex row, mid-height, instead of bottom-centre. That is the
          only reason this div exists — do not fold it into the FadeIn.
          Position is unchanged by dropping the word: -translate-x-1/2 is a
          percentage of the element's OWN width, so a 1px-wide wrapper is still
          centred on 50%, and bottom-10 anchors the bottom edge the rule already
          sat on. motion-reduce:animate-none is new — the pulse was unguarded
          before, and it is now the only thing moving in this corner. */}
      <div className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <FadeIn delay={700}>
          <div
            aria-hidden="true"
            className="w-px h-8 bg-gray-300 animate-pulse motion-reduce:animate-none"
          />
        </FadeIn>
      </div>
    </Section>
  )
}

export default Hero

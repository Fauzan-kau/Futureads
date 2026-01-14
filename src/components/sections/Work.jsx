import { useState, useEffect } from 'react'
import { Container, Section, Grid } from '../layout'
import { Heading, Text, Button } from '../ui'
import { FadeIn } from '../animation'
import works from '../../data/works'

const WorkCard = ({ work, index, isNew = false, baseDelay = 0 }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isVisible, setIsVisible] = useState(!isNew)

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isNew])

  const handleImageClick = () => {
    if (work.images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % work.images.length)
    }
  }

  const animationStyle = isNew ? {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 500ms ease-out ${baseDelay}ms, transform 500ms ease-out ${baseDelay}ms`,
  } : {}

  const content = (
    <div
      className="group cursor-pointer"
      onClick={handleImageClick}
      style={animationStyle}
    >
        <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-6 relative">
          <img
            src={work.images[currentImage]}
            alt={`${work.client} - ${work.category}`}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Image counter badge */}
          {work.images.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm">
              <Text size="caption" className="font-mono">
                {currentImage + 1}/{work.images.length}
              </Text>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between">
          <div>
            <Heading as="h3" size="subtitle" weight="semibold" className="mb-1 group-hover:translate-x-1 transition-transform duration-300">
              {work.client}
            </Heading>
            <Text size="caption" color="muted">
              {work.category}
            </Text>
          </div>
          <div className="w-6 h-px bg-gray-300 mt-3 group-hover:w-10 group-hover:bg-black transition-all duration-300" />
        </div>
      </div>
  )

  if (isNew) {
    return content
  }

  return (
    <FadeIn delay={index * 100}>
      {content}
    </FadeIn>
  )
}

const Work = () => {
  const [showAll, setShowAll] = useState(false)
  const featuredWorks = works.filter((w) => w.featured)
  const featuredCount = featuredWorks.length

  return (
    <Section id="work" padding="large" className="relative overflow-hidden">
      {/* Background text decoration - smaller on mobile */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[30vw] md:text-[20vw] font-bold text-gray-50 select-none pointer-events-none whitespace-nowrap">
        WORK
      </div>

      <Container className="relative z-10">
        <FadeIn>
          <div className="mb-10 md:mb-20">
            <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-4 md:mb-6">
              Selected Work
            </Text>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 md:gap-8">
              <div>
                <Heading as="h2" size="headline" className="mb-4">
                  Campaigns that make an impact
                </Heading>
                <div className="w-16 h-px bg-black" />
              </div>
              <Text color="muted" className="max-w-md text-sm md:text-base">
                Click on any project to browse through the creative assets.
                Each piece tells a story of collaboration and creativity.
              </Text>
            </div>
          </div>
        </FadeIn>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {works.map((work, index) => {
            const isFeatured = work.featured
            const shouldShow = showAll || isFeatured

            if (!shouldShow) return null

            const isNewlyRevealed = showAll && !isFeatured
            const delayIndex = index - featuredCount

            return (
              <WorkCard
                key={work.id}
                work={work}
                index={index}
                isNew={isNewlyRevealed}
                baseDelay={isNewlyRevealed ? delayIndex * 100 : 0}
              />
            )
          })}
        </div>

        {!showAll && works.length > featuredCount && (
          <FadeIn>
            <div className="mt-10 md:mt-20 text-center">
              <Button variant="secondary" size="large" onClick={() => setShowAll(true)}>
                View All Projects ({works.length - featuredCount} more)
              </Button>
            </div>
          </FadeIn>
        )}

        {/* Testimonial/Quote */}
        <FadeIn>
          <div className="mt-16 md:mt-32 max-w-3xl mx-auto text-center px-4">
            <div className="text-4xl md:text-6xl text-gray-200 mb-4 md:mb-6">&ldquo;</div>
            <Text size="large" className="italic mb-6 md:mb-8 leading-relaxed text-base md:text-lg">
              Working with FutureAds transformed our brand presence. Their creative
              approach and attention to detail exceeded our expectations.
            </Text>
            <Text size="caption" color="muted" className="uppercase tracking-wider">
              — Happy Client
            </Text>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}

export default Work

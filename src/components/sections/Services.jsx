import { Container, Section, Grid } from '../layout'
import { Heading, Text, Divider } from '../ui'
import { FadeIn } from '../animation'
import services from '../../data/services'

const ServiceCard = ({ service, index }) => {
  return (
    <FadeIn delay={index * 75}>
      <div className="group py-10 px-6 border-l-2 border-transparent hover:border-black hover:bg-gray-50 transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
          <Text size="caption" color="light" className="font-mono">
            {String(service.id).padStart(2, '0')}
          </Text>
          <div className="w-8 h-px bg-gray-300 group-hover:w-12 group-hover:bg-black transition-all duration-300" />
        </div>
        <Heading as="h3" size="title" className="mb-4 group-hover:translate-x-2 transition-transform duration-300">
          {service.title}
        </Heading>
        <Text color="muted" className="leading-relaxed">{service.description}</Text>
      </div>
    </FadeIn>
  )
}

const Services = () => {
  return (
    <Section id="services" background="gray" padding="large" className="relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-gray-200 rounded-full opacity-50" />
      <div className="absolute bottom-40 left-20 w-24 h-24 border border-gray-300 rounded-full opacity-30" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-5">
            <FadeIn>
              <Text size="caption" color="muted" className="uppercase tracking-[0.3em] mb-6">
                What We Do
              </Text>
              <Heading as="h2" size="headline" className="mb-6">
                Services designed to elevate your brand
              </Heading>
              <div className="w-16 h-px bg-black mb-8" />
              <Text color="muted" className="leading-relaxed">
                We offer a comprehensive suite of services tailored to meet your
                brand&apos;s unique needs. From strategy to execution, we&apos;re with
                you every step of the way.
              </Text>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn delay={200}>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <Heading as="span" size="headline" className="block mb-2">100%</Heading>
                  <Text size="caption" color="muted">Client Satisfaction</Text>
                </div>
                <div>
                  <Heading as="span" size="headline" className="block mb-2">24/7</Heading>
                  <Text size="caption" color="muted">Support Available</Text>
                </div>
                <div>
                  <Heading as="span" size="headline" className="block mb-2">Fast</Heading>
                  <Text size="caption" color="muted">Turnaround Time</Text>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <Divider className="mb-16" />

        <Grid cols={2} gap="large">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

export default Services

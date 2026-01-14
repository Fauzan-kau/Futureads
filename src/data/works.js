import kaziKitchen1 from '../assets/Kazi_kitchen.jpeg'
import kaziKitchen2 from '../assets/Kazi_kitchen2.jpeg'
import kaziKitchen3 from '../assets/Kazi_kitchen3.jpeg'
import kazi3 from '../assets/kazi3.jpeg'
import amiyas1 from '../assets/amiyas.jpeg'
import amiyas2 from '../assets/amiyas2.jpeg'
import wildzone1 from '../assets/wildzone.jpeg'
import wildzone2 from '../assets/wildzone2.jpeg'
import wildzone3 from '../assets/wildzone3.jpeg'
import kotta1 from '../assets/kotta.jpeg'
import kottaMain from '../assets/kottamain.jpeg'
import ksrrtc from '../assets/ksrrtc.jpeg'
import bocaJnrs from '../assets/boca_jnrs.jpeg'
import arackalTraders from '../assets/arackal_traders.jpeg'
import unique from '../assets/unique.jpeg'

const works = [
  {
    id: 1,
    client: 'Kazi Kitchen',
    category: 'Food & Beverage',
    description: 'Social media campaign showcasing authentic culinary experiences',
    images: [kaziKitchen1, kaziKitchen2, kaziKitchen3, kazi3],
    featured: true,
  },
  {
    id: 2,
    client: 'Wildzone',
    category: 'Lifestyle',
    description: 'Adventure brand identity and digital presence',
    images: [wildzone1, wildzone2, wildzone3],
    featured: true,
  },
  {
    id: 3,
    client: '90s Kotta',
    category: 'Entertainment',
    description: 'Retro-inspired branding for a nostalgic experience',
    images: [kottaMain, kotta1],
    featured: true,
  },
  {
    id: 4,
    client: 'Amiyas',
    category: 'Retail',
    description: 'Brand refresh and promotional campaign',
    images: [amiyas1, amiyas2],
    featured: false,
  },
  {
    id: 5,
    client: 'KSRRTC',
    category: 'Transportation',
    description: 'Public service awareness campaign',
    images: [ksrrtc],
    featured: false,
  },
  {
    id: 6,
    client: 'Boca Jnrs',
    category: 'Sports & Recreation',
    description: 'Dynamic sports club visual identity',
    images: [bocaJnrs],
    featured: false,
  },
  {
    id: 7,
    client: 'Arackal Traders',
    category: 'Business',
    description: 'Corporate identity and marketing collateral',
    images: [arackalTraders],
    featured: false,
  },
  {
    id: 8,
    client: 'Unique',
    category: 'Brand Identity',
    description: 'Distinctive brand positioning and creative assets',
    images: [unique],
    featured: false,
  },
]

export default works

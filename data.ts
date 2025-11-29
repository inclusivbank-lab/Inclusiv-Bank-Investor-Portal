import { ProjectData } from './types';

export const projects: ProjectData[] = [
  {
    id: 'soulware-ecosystem',
    title: 'The Soulware™ Ecosystem',
    category: 'Fintech / Social Impact',
    fundingAsk: '$10.5M Seed',
    valuation: '$105M Pre-money',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Fintech', 'Impact Investing', 'Financial Inclusion'],
    shortDescription: {
      en: "A comprehensive ecosystem delivering financial dignity to LGBTQ+, seniors, and migrants with measurable social impact.",
      es: "Un ecosistema integral que ofrece dignidad financiera a comunidades LGBTQ+, personas mayores y migrantes con impacto social medible."
    },
    fullDescription: {
      en: "The world's first ecosystem blending fintech with social impact. Includes LUCA™ (LGBTQ+ wallet), Inclusivbank™ (seniors/disabled), SAMMY™ (youth literacy), and 1ME™ (migrant identity). Powered by ROP™ (Return on People) metrics.",
      es: "El primer ecosistema del mundo que combina fintech con impacto social. Incluye LUCA™ (billetera LGBTQ+), Inclusivbank™ (mayores/discapacitados), SAMMY™ (alfabetización juvenil) y 1ME™ (identidad migrante). Impulsado por métricas ROP™ (Retorno en Personas)."
    }
  },
  {
    id: 'treesla',
    title: 'TREESLA™',
    category: 'Clean Energy / Biotech',
    fundingAsk: '$5M Seed',
    valuation: 'Undisclosed',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Biotech', 'Clean Energy', 'Hardware'],
    shortDescription: {
      en: "The world's first non-invasive bio-electrical harvesting platform transforming trees into clean power stations.",
      es: "La primera plataforma de recolección bioeléctrica no invasiva del mundo que transforma árboles en estaciones de energía limpia."
    },
    fullDescription: {
      en: "Turning trees into decentralized power stations using RootSync™ and SapStream™ technology. Validated with MIT Media Lab and Fraunhofer ISE. Addresses a $1.2T renewable market without harming nature.",
      es: "Convierte árboles en estaciones de energía descentralizadas utilizando tecnología RootSync™ y SapStream™. Validado con MIT Media Lab y Fraunhofer ISE. Aborda un mercado renovable de $1.2T sin dañar la naturaleza."
    }
  },
  {
    id: 'gchs',
    title: 'GCHS™ (Global Career Homologation)',
    category: 'EdTech / HR Tech',
    fundingAsk: '$10M Seed',
    valuation: 'Undisclosed',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['AI', 'Blockchain', 'Social Impact'],
    shortDescription: {
      en: "AI-driven career homologation making professional recognition borderless and verifiable.",
      es: "Homologación profesional impulsada por IA que hace que el reconocimiento profesional sea verificable y sin fronteras."
    },
    fullDescription: {
      en: "Solving the global talent crisis for 280M migrants. Uses AI and Blockchain to validate credentials instantly. Operates on a 'Half Profit, Half Empowerment' model: every paid verification funds one for a refugee.",
      es: "Resolviendo la crisis de talento global para 280M de migrantes. Utiliza IA y Blockchain para validar credenciales al instante. Opera bajo el modelo 'Mitad Beneficio, Mitad Empoderamiento'."
    }
  },
  {
    id: 'kronos',
    title: 'KRONOS™ + Evolv™',
    category: 'Web3 / Social Economy',
    fundingAsk: '$5M Pre-Seed',
    valuation: '$25M Cap',
    imageUrl: 'https://images.unsplash.com/photo-1621504450168-38f647315648?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Crypto', 'Social Media', 'Human Economy'],
    shortDescription: {
      en: "A sovereign human economy where time is currency and kindness is status.",
      es: "Una economía humana soberana donde el tiempo es moneda y la amabilidad es estatus."
    },
    fullDescription: {
      en: "Standardizes the value of human time. KRONOS™ token rewards wages and volunteering. Evolv™ is the social platform where 'good vibes' increase your creditworthiness. Includes a debit card and POS system.",
      es: "Estandariza el valor del tiempo humano. El token KRONOS™ recompensa salarios y voluntariado. Evolv™ es la plataforma social donde las 'buenas vibras' aumentan tu solvencia crediticia."
    }
  },
  {
    id: 'solarchain',
    title: 'SOLARCHAIN™',
    category: 'Blockchain / Energy',
    fundingAsk: '$25M Series A',
    valuation: 'Undisclosed',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Blockchain', 'ESG', 'Solar'],
    shortDescription: {
      en: "The first blockchain defined by the sun, using Proof-of-Solar™ consensus.",
      es: "La primera blockchain definida por el sol, utilizando el consenso Proof-of-Solar™."
    },
    fullDescription: {
      en: "Revolutionizing blockchain sustainability. Validators must demonstrate real-time solar energy production via IoT oracles. Creates sSUN energy credits and SOLC governance tokens. Targeting $300M ARR.",
      es: "Revolucionando la sostenibilidad blockchain. Los validadores deben demostrar producción de energía solar en tiempo real. Crea créditos de energía sSUN y tokens de gobernanza SOLC."
    }
  },
  {
    id: 'sammy',
    title: 'SAMMY™',
    category: 'Fintech / EdTech',
    fundingAsk: '$3.5M Series A',
    valuation: 'Undisclosed',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['Youth', 'Education', 'Fintech'],
    shortDescription: {
      en: "AI-powered, gamified digital wallet designed specifically for children ages 5-18.",
      es: "Billetera digital gamificada impulsada por IA diseñada específicamente para niños de 5 a 18 años."
    },
    fullDescription: {
      en: "Addressing a $14.2B market crisis in youth financial literacy. Combines real money management with structured education. Bridges seamlessly into the 1ME™ adult financial identity system.",
      es: "Abordando una crisis de mercado de $14.2B en alfabetización financiera juvenil. Combina gestión de dinero real con educación estructurada. Se integra perfectamente con el sistema de identidad financiera 1ME™."
    }
  },
  {
    id: 'luca',
    title: 'LUCA™',
    category: 'Fintech',
    fundingAsk: '$5M Series A',
    valuation: 'Undisclosed',
    imageUrl: 'https://images.unsplash.com/photo-1655720406100-3958d2c949c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['LGBTQ+', 'Banking', 'Inclusion'],
    shortDescription: {
      en: "The digital wallet for the global LGBTQ+ community (Love, Unity, Care, Acceptance).",
      es: "La billetera digital para la comunidad LGBTQ+ global (Amor, Unidad, Cuidado, Aceptación)."
    },
    fullDescription: {
      en: "Targeting 400M+ individuals with $3.7T purchasing power. Features 'Chosen Name' display, safety/privacy controls, and a directory of inclusive businesses.",
      es: "Dirigido a más de 400M de personas con un poder adquisitivo de $3.7T. Cuenta con visualización de 'Nombre Elegido', controles de seguridad/privacidad y un directorio de negocios inclusivos."
    }
  },
  {
    id: 'ark',
    title: 'The Ark Project',
    category: 'Web3 / Conservation',
    fundingAsk: '£4M Seed',
    valuation: 'Undisclosed',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['NFT', 'Conservation', 'Climate'],
    shortDescription: {
      en: "Turning carbon offsets into digital proof of impact via living NFTs.",
      es: "Convirtiendo compensaciones de carbono en pruebas digitales de impacto mediante NFTs vivos."
    },
    fullDescription: {
      en: "A living digital sanctuary. NFTs automatically purchase and retire carbon credits. Collections include Forests of the World and Endangered Species. Backed by verified environmental data.",
      es: "Un santuario digital vivo. Los NFTs compran y retiran automáticamente créditos de carbono. Las colecciones incluyen Bosques del Mundo y Especies en Peligro. Respaldado por datos ambientales verificados."
    }
  }
];
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import SectionRail from './components/SectionRail'
import SplashLoader from './components/SplashLoader'
import CommandPalette from './components/CommandPalette'
import SmoothScroll from './components/SmoothScroll'
import RocketTop from './components/RocketTop'
import Konami from './components/Konami'
import StarsBG from './components/StarsBG'

// Heavy sections — code-split so the initial bundle stays tight
const QuantZone        = lazy(() => import('./components/QuantZone'))
const SkillsGalaxy     = lazy(() => import('./components/SkillsGalaxy'))
const Terminal         = lazy(() => import('./components/Terminal'))
const AchievementVault = lazy(() => import('./components/AchievementVault'))

function SectionSkeleton() {
  return (
    <div className="relative border-t border-white/10 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-4 w-40 bg-white/5 mb-4 animate-pulse" />
        <div className="h-16 w-2/3 bg-white/5 animate-pulse" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="relative">
      {/* Deep space base */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{ backgroundColor: '#02030a' }}
      />

      {/* Nebula glows — primary galaxy mood, minor dawn ember at the bottom */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 nebula-drift"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 15% 10%, rgba(108, 42, 201, 0.32), transparent 60%)',
            'radial-gradient(ellipse 55% 45% at 85% 25%, rgba(255, 36, 71, 0.18), transparent 60%)',
            'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(44, 91, 255, 0.18), transparent 65%)',
            'radial-gradient(ellipse 50% 45% at 90% 80%, rgba(147, 51, 234, 0.16), transparent 60%)',
            /* subtle dawn ember hint at the bottom */
            'radial-gradient(ellipse 70% 25% at 50% 100%, rgba(255, 107, 58, 0.14), transparent 70%)',
          ].join(', '),
        }}
      />

      {/* Twinkling starfield */}
      <StarsBG />

      <SplashLoader />
      <CommandPalette />
      <Konami />
      <ScrollProgress />
      <RocketTop />
      <Navbar />
      <SectionRail />
      <SmoothScroll>
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Certifications />
          <Projects />
          <Suspense fallback={<SectionSkeleton />}>
            <QuantZone />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <SkillsGalaxy />
          </Suspense>
          <Skills />
          <Suspense fallback={<SectionSkeleton />}>
            <Terminal />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <AchievementVault />
          </Suspense>
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </div>
  )
}

import Header from '../components/Sections/LandingPage/Header'
import FeaturesSectionDemo from '../components/Sections/LandingPage/Feature'
import TestimonialSection from '../components/Sections/LandingPage/TestimonialSection'
import About from '../components/Sections/LandingPage/About'
import Stats from '../components/Sections/LandingPage/Stats'
import FadeInSection from '../components/ui/FadeInSection'
import { ThemeProvider } from '../contexts/ThemeContext'
import Contact from '../components/Sections/LandingPage/Contact'
const HomePage = () => (
    <>
      <div className="overflow-y-scroll overflow-x-hidden scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <FadeInSection><Header /></FadeInSection>
        <FadeInSection><About /></FadeInSection>
        <FadeInSection><Stats /></FadeInSection>
        <FeaturesSectionDemo />
        <FadeInSection><TestimonialSection /></FadeInSection>
        <FadeInSection><Contact /></FadeInSection>

      </div>
    </>
  );
export default HomePage;  
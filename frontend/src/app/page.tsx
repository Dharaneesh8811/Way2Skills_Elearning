import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollReveal from "../components/layout/ScrollReveal";

import HeroSection from "../components/home/HeroSection";
import FeaturedCourse from "../components/home/FeaturedCourse";
import WhyWay2Skills from "../components/home/WhyWay2Skills";
import Testimonials from "../components/home/Testimonials";
import FAQSection from "../components/home/FAQSection";
import LearningJourney from "../components/home/LearningJourney";

export default function Home() {
  return (
    <main className="way2-home-surface min-h-screen overflow-x-clip text-white">
      <Navbar />

      {/* Cinematic hero with particle globe */}
      <HeroSection />

      {/* Course programme */}
      <ScrollReveal>
        <FeaturedCourse />
      </ScrollReveal>

      {/* Why Way2Skills */}
      <ScrollReveal delay={80}>
        <WhyWay2Skills />
      </ScrollReveal>

      {/* Student stories */}
      <ScrollReveal delay={60}>
        <Testimonials />
      </ScrollReveal>

      {/* Frequently asked questions */}
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      {/* Training and internship timeline */}
      <ScrollReveal delay={80}>
        <LearningJourney />
      </ScrollReveal>

      <Footer />
    </main>
  );
}

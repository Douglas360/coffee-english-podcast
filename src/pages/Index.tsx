import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Features } from "@/components/Features";
import { LearnMore } from "@/components/LearnMore";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { CallToAction } from "@/components/CallToAction";
import { CountdownBanner } from "@/components/CountdownBanner";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { Blog } from "@/components/Blog";
import { GoogleAdsense } from "@/components/GoogleAdsense";
import { LazyMotion, domAnimation, m } from "framer-motion";

const Index = () => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-secondary/50 to-white"
      >
        <CountdownBanner />
        <Hero />
        <GoogleAdsense 
          slot="1234567890" 
          className="my-8 px-4"
          style={{ display: 'block', textAlign: 'center' }}
        />
        <Benefits />
        <Features />
        <GoogleAdsense 
          slot="0987654321" 
          className="my-8 px-4"
          style={{ display: 'block', textAlign: 'center' }}
        />
        <LearnMore />
        <Blog />
        <GoogleAdsense 
          slot="5432109876" 
          className="my-8 px-4"
          style={{ display: 'block', textAlign: 'center' }}
        />
        <Testimonials />
        <Pricing />
        <CallToAction />
        <NewsletterPopup />
      </m.div>
    </LazyMotion>
  );
};

export default Index;
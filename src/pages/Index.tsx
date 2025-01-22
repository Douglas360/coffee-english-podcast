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
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CountdownBanner />
      <Hero />
      <Benefits />
      <Features />
      <LearnMore />
      {/*<Blog />*/}
      <Testimonials />
      <Pricing />
      <CallToAction />
      <NewsletterPopup />
    </motion.div>
  );
};

export default Index;
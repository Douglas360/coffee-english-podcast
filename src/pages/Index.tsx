import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Features } from "@/components/Features";
import { LearnMore } from "@/components/LearnMore";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { CallToAction } from "@/components/CallToAction";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <Benefits />
      <Features />
      <LearnMore />
      <Testimonials />
      <Pricing />
      <CallToAction />
    </motion.div>
  );
};

export default Index;
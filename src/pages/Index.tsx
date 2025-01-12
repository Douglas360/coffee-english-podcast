import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Testimonials } from "@/components/Testimonials";
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
      <Testimonials />
      <CallToAction />
    </motion.div>
  );
};

export default Index;
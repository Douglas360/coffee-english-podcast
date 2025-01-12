import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-secondary to-white">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Transform Your English in Just 30 Days
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Master English Fluency With Confidence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unlock your potential with our proven system that has helped thousands achieve English fluency. Start speaking confidently in any situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8">
              Start Your Journey Now
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 pointer-events-none" />
    </section>
  );
};
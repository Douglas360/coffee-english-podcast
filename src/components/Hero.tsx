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
          <img
            src="/lovable-uploads/fbdf9ea3-08c8-498e-9a45-f967045b8425.png"
            alt="Coffee & English Logo"
            className="w-32 h-32 mx-auto mb-8 rounded-full shadow-lg"
          />
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Transform Your English in Just 30 Days
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Master English While Enjoying Your Coffee
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our unique learning experience that combines the comfort of your daily coffee break with effective English learning techniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white px-8"
              onClick={() => window.location.href = "https://pay.hotmart.com/Q97456947V?bid=1736708094909"}
            >
              Start Your Journey Now - Only $3.99
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary/5"
              onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Join thousands of successful learners today!
          </p>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 pointer-events-none" />
    </section>
  );
};
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Shield, Award } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-accent/20 text-accent rounded-full">
            Limited Time Special Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't Let Your Dream of Speaking English Wait
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Imagine yourself in 30 days, speaking English with confidence and fluency. 
            This could be you! Join thousands of students who have already transformed their lives.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 justify-center">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">Lifetime Access</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">30-day Guarantee</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm">Certificate Included</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <span className="text-2xl line-through text-muted-foreground">$97</span>
              <span className="text-4xl font-bold text-primary">$3.99</span>
            </div>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white px-8 group w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = "https://pay.hotmart.com/Q97456947V?bid=1736708094909"}
            >
              Start Now
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            30-day unconditional money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
};
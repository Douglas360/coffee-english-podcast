import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your English?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of successful learners and start your journey to English fluency today.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white px-8 group"
            onClick={() => window.location.href = "https://pay.hotmart.com/Q97456947V?bid=1736708094909"}
          >
            Get Started Now
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            30-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
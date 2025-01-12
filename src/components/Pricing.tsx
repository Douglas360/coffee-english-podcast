import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const features = [
  "30 Days of Structured Learning",
  "Daily Practice Exercises",
  "Real-world Conversation Scripts",
  "Progress Tracking Tools",
  "Community Support Group",
  "Mobile-friendly Format",
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Special Limited Time Offer
          </h2>
          <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="text-2xl line-through text-muted-foreground">$97</span>
              <span className="text-4xl font-bold text-primary">$3.99</span>
            </div>
            <p className="text-muted-foreground mb-6">
              One-time payment for lifetime access
            </p>
            <ul className="space-y-4 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="text-accent w-5 h-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="w-full bg-accent hover:bg-accent/90"
              onClick={() => window.location.href = "https://pay.hotmart.com/Q97456947V?bid=1736708094909"}
            >
              Get Started Today
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              30-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
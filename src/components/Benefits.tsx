import { Check } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Structured Learning Path",
    description: "Follow our proven 30-day curriculum designed for rapid progress",
  },
  {
    title: "Real-World Practice",
    description: "Engage in practical exercises that mirror real conversations",
  },
  {
    title: "Confidence Building",
    description: "Develop natural fluency through progressive speaking exercises",
  },
  {
    title: "Lifetime Access",
    description: "Learn at your own pace with unlimited access to all materials",
  },
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our Method?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive approach combines proven techniques with modern learning methods to ensure your success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
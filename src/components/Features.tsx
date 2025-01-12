import { BookOpen, Coffee, Globe, MessageCircle, Target, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Target,
    title: "Goal-Oriented Learning",
    description: "Clear objectives and milestones for each day of your learning journey",
  },
  {
    icon: Coffee,
    title: "Relaxed Learning Environment",
    description: "Learn at your own pace in a stress-free, enjoyable atmosphere",
  },
  {
    icon: MessageCircle,
    title: "Interactive Practice",
    description: "Engage in real-world conversations and practical exercises",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a community of learners and practice together",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Material",
    description: "Access to carefully curated content and learning resources",
  },
  {
    icon: Globe,
    title: "Global Opportunities",
    description: "Open doors to international careers and connections",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our Method?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive approach combines proven techniques with modern learning methods
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <feature.icon className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
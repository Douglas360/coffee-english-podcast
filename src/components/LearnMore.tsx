import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Coffee, Check, Brain, Globe, Clock } from "lucide-react";

export const LearnMore = () => {
  const benefits = [
    {
      icon: <Coffee className="w-6 h-6 text-primary" />,
      title: "Learn During Coffee Breaks",
      description: "Transform your daily coffee ritual into an effective learning experience."
    },
    {
      icon: <Brain className="w-6 h-6 text-primary" />,
      title: "Neurolinguistic Programming",
      description: "Leverage proven NLP techniques to accelerate your learning process."
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Real-World Application",
      description: "Practice with real conversations and practical scenarios."
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Quick Results",
      description: "See noticeable improvement in just 30 days of consistent practice."
    }
  ];

  return (
    <section id="learn-more" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Unlock Your English Potential Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Imagine confidently speaking English in any situation, from business meetings to casual conversations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-start gap-4">
                  {benefit.icon}
                  <div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Special Limited Time Offer
            </h3>
            <div className="flex justify-center items-center gap-2 mb-6">
              <span className="text-2xl line-through text-muted-foreground">$97</span>
              <span className="text-4xl font-bold text-primary">$3.99</span>
            </div>
            <ul className="space-y-3 mb-8 max-w-md mx-auto text-left">
              <li className="flex items-center gap-2">
                <Check className="text-accent w-5 h-5" />
                <span>30 Days of Structured Learning</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-accent w-5 h-5" />
                <span>Daily Practice Exercises</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-accent w-5 h-5" />
                <span>Real-world Conversation Scripts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-accent w-5 h-5" />
                <span>Progress Tracking Tools</span>
              </li>
            </ul>
            <Button
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 mb-4"
              onClick={() => window.location.href = "https://pay.hotmart.com/Q97456947V?bid=1736708094909"}
            >
              Get Started Today - Only $3.99
            </Button>
            <p className="text-sm text-muted-foreground">
              30-day money-back guarantee. Start your journey risk-free!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
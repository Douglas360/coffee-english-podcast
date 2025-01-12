import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Professional",
    content: "After struggling with English for years, this program helped me gain the confidence to lead international meetings.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Graduate Student",
    content: "The structured approach and daily practice transformed my English skills. Now I can express myself clearly and naturally.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Travel Enthusiast",
    content: "This program exceeded my expectations. I can now confidently travel and connect with people from around the world.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied learners who have transformed their English speaking abilities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-white shadow-sm"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
import { Check, Coffee, Brain, Target, Clock } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Coffee,
    title: "Aprendizado Natural",
    description: "Transforme seu momento de café em uma experiência única de imersão no inglês",
  },
  {
    icon: Brain,
    title: "Método Científico",
    description: "Técnicas de PNL e aprendizado acelerado para resultados surpreendentes",
  },
  {
    icon: Target,
    title: "Resultados Rápidos",
    description: "Veja progressos reais em apenas 30 dias de prática consistente",
  },
  {
    icon: Clock,
    title: "Flexibilidade Total",
    description: "Estude no seu ritmo, sem pressão, com acesso vitalício ao material",
  },
];

export const Benefits = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Descubra o Poder da Nossa Metodologia
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Uma abordagem revolucionária que combina ciência e praticidade para seu sucesso
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-card backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
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
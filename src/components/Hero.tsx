import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-secondary/80 to-white">
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
            className="w-32 h-32 mx-auto mb-8 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full animate-pulse">
              Descubra o Segredo para Falar Inglês com Naturalidade
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Transforme seu Café Diário em uma{" "}
              <span className="italic">Poderosa Ferramenta de Aprendizado</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Imagine dominar o inglês naturalmente, sem pressão, enquanto desfruta do seu momento de café. 
              Nossa metodologia exclusiva combina o prazer do seu ritual diário com técnicas comprovadas de aprendizado acelerado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white px-8 transform hover:scale-105 transition-all duration-300 shadow-lg"
                onClick={() => window.location.href = "https://pay.hotmart.com/Q97456947V?bid=1736708094909"}
              >
                Comece Agora - Apenas $3.99
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary/5 group"
                onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Descubra Como
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Junte-se a mais de 1,000+ alunos satisfeitos
              </p>
              <div className="flex justify-center items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 pointer-events-none" />
    </section>
  );
};
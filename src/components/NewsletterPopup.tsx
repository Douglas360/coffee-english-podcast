import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already interacted with popup
    const popupShown = localStorage.getItem("newsletterPopupShown");
    if (popupShown) return;

    // Show popup after 12 seconds
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 12000);

    // Track scroll position
    const handleScroll = () => {
      if (hasInteracted) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 50) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasInteracted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      localStorage.setItem("newsletterPopupShown", "true");
      setHasInteracted(true);
      setIsVisible(false);
      
      toast({
        title: "Sucesso!",
        description: "Seu e-book foi enviado para seu email. Confira sua caixa de entrada!",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Houve um erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setHasInteracted(true);
    localStorage.setItem("newsletterPopupShown", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">
                7 Secrets in English You Need to Know
              </h2>
              <p className="text-muted-foreground">
                Receba gratuitamente nosso e-book exclusivo e transforme seu aprendizado de inglês!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Baixe seu E-book Grátis!"}
              </Button>
            </form>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Ao se inscrever, você concorda em receber nossos emails. 
              Você pode cancelar a qualquer momento.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const popupShown = localStorage.getItem("newsletterPopupShown");
    if (popupShown) return;

    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 12000);

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
      const { data, error } = await supabase.functions.invoke('subscribe', {
        body: { email, name }
      });

      if (error) throw new Error(error.message);

      localStorage.setItem("newsletterPopupShown", "true");
      setHasInteracted(true);
      setIsVisible(false);
      
      toast({
        title: "Success!",
        description: "Your e-book has been sent to your email. Check your inbox!",
        duration: 5000,
      });

      window.open('https://drive.google.com/file/d/1Xdq73qBmEsIVY2czYmmNBkdmfmJCJ6zI/view?usp=sharing', '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your subscription. Please try again.",
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
              <img
                src="/lovable-uploads/c2fdcffe-a85f-4fe9-bad0-2270670ff863.png"
                alt="7 Secrets for ESL Learners"
                className="w-1/2 h-auto mx-auto mb-4 rounded-lg"
              />
              <h2 className="text-2xl font-bold text-primary mb-2">
                7 Secrets for ESL Learners
              </h2>
              <p className="text-muted-foreground">
                Get our exclusive e-book for free and transform your English learning journey!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your best email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Download Your Free E-book!"}
              </Button>
            </form>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              By subscribing, you agree to receive our emails. 
              You can unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
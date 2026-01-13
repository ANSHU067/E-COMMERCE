import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#f3f0ea]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase border border-primary/20 rounded-full">
            New Collection 2025
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 text-balance">
            Elevate Your <span className="text-accent italic">Everyday</span> Essentials
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
            Curated minimalism for the modern lifestyle. Discover objects that bring clarity and beauty to your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-primary/25">
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-transparent border border-primary/20 text-primary rounded-full font-medium hover:bg-white/50 transition-all duration-300">
              View Lookbook
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
            {/* fashion model portrait clean minimal */}
            <img 
              src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1964&auto=format&fit=crop" 
              alt="Hero Collection" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Floating card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-8 -left-12 z-20 bg-white p-6 rounded-2xl shadow-xl max-w-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-display font-bold text-xl">
                50%
              </div>
              <div>
                <p className="font-bold text-primary">Summer Sale</p>
                <p className="text-sm text-muted-foreground">On selected items until Friday</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

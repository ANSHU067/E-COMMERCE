import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSubscribe } from "@/hooks/use-subscribers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertSubscriberSchema, type InsertSubscriber } from "@shared/schema";
import { motion } from "framer-motion";

export function Newsletter() {
  const subscribe = useSubscribe();
  
  const form = useForm<InsertSubscriber>({
    resolver: zodResolver(insertSubscriberSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: InsertSubscriber) => {
    subscribe.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Join the List
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/80 mb-10"
          >
            Subscribe to receive updates, access to exclusive deals, and more.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative max-w-md mx-auto"
          >
            <input
              {...form.register("email")}
              placeholder="Enter your email address"
              className="w-full h-14 pl-6 pr-32 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
              disabled={subscribe.isPending}
            />
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="absolute right-1 top-1 bottom-1 px-6 rounded-full bg-white text-primary font-bold hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {subscribe.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </motion.form>
          
          {form.formState.errors.email && (
            <p className="mt-3 text-red-400 text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        {/* Featured Products Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <span className="text-accent font-bold uppercase tracking-wider text-xs mb-2 block">
                  Curated Selection
                </span>
                <h2 className="text-4xl font-display font-bold">Featured Products</h2>
              </div>
              <button className="text-sm font-bold border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-colors">
                View All Products
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                Failed to load products. Please try again later.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products && products.length > 0 ? (
                  products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))
                ) : (
                  // Empty state in case DB has no products yet
                  <div className="col-span-full text-center py-20 bg-secondary/30 rounded-2xl">
                    <p className="text-muted-foreground">No products available yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features/Values Section */}
        <section className="py-24 bg-[#f3f0ea]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { title: "Sustainable Materials", desc: "Sourced responsibly with minimal environmental impact." },
                { title: "Artisan Craftsmanship", desc: "Hand-finished details by skilled master artisans." },
                { title: "Lifetime Warranty", desc: "Quality guaranteed for life. We stand by our work." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto text-xl font-display font-bold text-accent shadow-sm">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold font-display">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}

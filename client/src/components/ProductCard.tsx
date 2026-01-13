import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { type Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart();
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your bag.`,
    });
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary mb-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay with Quick Add */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 w-12 h-12 bg-white text-primary rounded-full shadow-lg flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
        >
          <Plus className="w-6 h-6" />
        </button>

        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-bold uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg leading-tight group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {product.description}
        </p>
        <div className="text-primary font-medium pt-1">
          {formattedPrice}
        </div>
      </div>
    </motion.div>
  );
}

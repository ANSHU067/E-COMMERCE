import { Link } from "wouter";
import { ShoppingBag, Menu, Search } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";

export function Header() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-4 shadow-sm" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 -ml-2 hover:bg-black/5 rounded-full lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="text-2xl font-display font-bold tracking-tight">
            LUMIÈRE
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Shop</Link>
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">New Arrivals</Link>
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Collections</Link>
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button className="relative p-2 hover:bg-black/5 rounded-full transition-colors group">
            <ShoppingBag className="w-5 h-5 group-hover:text-accent transition-colors" />
            {count > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

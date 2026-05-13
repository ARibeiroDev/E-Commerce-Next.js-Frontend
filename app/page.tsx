import ProductSection from "@/components/products/ProductSection";
import Presentation from "@/components/sections/Presentation";
import Services from "@/components/sections/Services";
import Slider from "@/components/ui/Slider";

export default function Home() {
  return (
    <main className="flex-1 animate-appear">
      <Slider />
      <Services />
      <Presentation />
      <ProductSection
        title="New Arrivals"
        params={{ page: 1, limit: 6, sortBy: "createdAt", orderBy: "desc" }}
      />
    </main>
  );
}

import ShopLayout from "@/components/layout/shop-layout";
import CartView from "@/components/cart/cart-view";
import AiRecommendations from "@/components/cart/ai-recommendations";

export default function CartPage() {
  return (
    <ShopLayout>
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Your Cart</h1>
        <div className="grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
                <CartView />
            </div>
            <div className="lg:col-span-1 mt-8 lg:mt-0">
                <AiRecommendations />
            </div>
        </div>
    </ShopLayout>
  );
}

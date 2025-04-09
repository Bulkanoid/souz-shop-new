import Catalog from '@/components/catalog/Catalog';
import ProductShowcase from '@/components/productCase/ProductShowcase';
import SliderMenu from '@/components/slider/Slider';

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <SliderMenu />
      <Catalog />
      {/* <ProductShowcase title={{ RU: 'Новинки', EN: 'News' }} type={'new'} backgroundText="Новинки" /> */}
    </div>
  );
}

import { productTabs, review, Sliderr } from "./api-services/homeApi";
import AboutSection from "./Components/Home-Components/AboutSection";
import CollectionSection from "./Components/Home-Components/CollectionSection";
import EmailSection from "./Components/Home-Components/EmailSection";
import Homebanner from "./Components/Home-Components/Homebanner";
import ImagesSection from "./Components/Home-Components/ImagesSection";
import NewArrivalsSection from "./Components/Home-Components/NewArrivalsSection";
import ProductsSection from "./Components/Home-Components/ProductsSection";
import ShippingSection from "./Components/Home-Components/ShippingSection";
import PowderDescriptionSection from "./Components/Home-Components/PowderDescriptionSection";

export default async function Home() {
  let productTabData = null;
  try {
    productTabData = await productTabs();
  } catch (err) {
    productTabData = null;
  }

  let SliderData = null;
  try {
    SliderData = await Sliderr();
  } catch (err) {
    SliderData = null;
  }

  let reviewData = null;
  try {
    reviewData = await review();
  } catch (err) {
    reviewData = null;
  }

  return (
    <div className="bg-white">
      <Homebanner
        imagepath={SliderData?.staticPath}
        sdata={SliderData?.data}
      />
      <CollectionSection />
      <NewArrivalsSection
        path={productTabData?.staticPath}
        data={productTabData?.data || []}
      />
      <ImagesSection />
      <ProductsSection
        path={productTabData?.staticPath}
        data={productTabData?.data || []}
      />
      <ShippingSection />
      <AboutSection
        imagespath={reviewData?.staticPath}
        rsdata={reviewData?.data || []}
      />
      <PowderDescriptionSection />
      <EmailSection />
    </div>
  );
}




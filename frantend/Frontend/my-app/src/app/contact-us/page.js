import EnquriFromSection from "../Components/ContactUs-Components/EnquriFromSection";
import MapSection from "../Components/ContactUs-Components/MapSection";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact JGB Trading in Raipur for calcium carbonate, anti-moisture powder, mineral specifications, samples and bulk quotations.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    url: "/contact-us",
    title: "Contact JGB Trading Private Limited",
    description:
      "Request mineral powder specifications, samples or a bulk quotation from JGB Trading.",
  },
};

export default function ContactUsPage() {
  return (
    <main>
      <h1 className="sr-only">Contact JGB Trading Private Limited</h1>
      <MapSection/>
      <EnquriFromSection/>
    </main>
  );
}

import InnerPageHero from "../Components/Page-Sections/InnerPageHero";

const faqs = [
  {
    question: "What types of Calcium and Anti Moisture Powder grades are available?",
    answer:
      "All types of grades are available at JGB Trading Private Limited. We offer Natural Ground Calcium Carbonate (GCC), Precipitated Calcium Carbonate (PCC), Active Anti-Moisture Desiccant Powder, and Surface-Treated Coated grades from 300 to 1200+ mesh.",
  },
  {
    question: "What packaging sizes do you supply?",
    answer:
      "We supply material in standard 25 KG and 50 KG moisture-resistant HDPE/PP laminated bags. For large industrial consumers, 1000 KG (1-ton) jumbo bags and bulk truckloads are also readily arranged.",
  },
  {
    question: "Where is your dispatch unit located?",
    answer:
      "Our supply operations are based at Mahadev Ghat Rd Raipur, Raipur 492001, Chhattisgarh. We provide expedited transport dispatch across all Indian states and industrial corridors.",
  },
  {
    question: "How can I request material samples or commercial bulk pricing?",
    answer:
      "You can contact our sales specialists directly by calling or WhatsApping 8810426236, emailing info@jgbtrading.com, or submitting the contact form on our website.",
  },
];

export default function FrequentlyQuestionsPage() {
  return (
    <div className="bg-white">
      <InnerPageHero title="Frequently Asked Questions" />

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[2px] text-[#0b4ba2]">
              JGB Trading Support
            </span>
            <h2 className="mt-2 text-[28px] font-extrabold text-[#0f2b5c] sm:text-[34px]">
              Mineral Powder &amp; Supply Inquiries
            </h2>
            <p className="mx-auto mt-3 max-w-[650px] text-sm text-slate-500">
              Find quick answers regarding our Calcium Powder, Anti Moisture Powder, grade options, and logistics.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0b4ba2]"
              >
                <summary className="cursor-pointer list-none text-base font-bold text-[#0f2b5c]">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


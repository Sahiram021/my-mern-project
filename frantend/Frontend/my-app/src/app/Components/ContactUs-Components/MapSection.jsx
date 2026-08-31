import React from "react";
import InnerPageHero from "../Page-Sections/InnerPageHero";

export default function MapSection() {
  return (
    <section className="w-full">
      <InnerPageHero title="Contact JGB Trading" />
      <div className="container mx-auto px-4 py-7">
        <div className="w-full">
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59508.82823376174!2d81.5831518177893!3d21.23789069151525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dda23be28229%3A0x13549113e700a400!2sMahadev%20Ghat%20Rd%2C%20Raipur%2C%20Chhattisgarh%20492001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="h-[320px] w-full border-0 md:h-[450px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="JGB Trading Raipur Location Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

  

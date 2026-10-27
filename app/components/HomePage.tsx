import Navbar from "./Navbar";
import Hero from "./Hero";
import Stats from "./Stats";
import Certifications from "./Certifications";
import Services from "./Services";
import Featured from "./Featured";
import About from "./About";
import Location from "./Location";
import CoastVideos from "./CoastVideos";
import News from "./News";
import Testimonials from "./Testimonials";
import Associates from "./Associates";
import Contact from "./Contact";
import Footer from "./Footer";
import { getOrderedPropertyCards } from "../lib/listings";

/** The home page, shared by "/" (English) and "/es" (Spanish). The language is
 *  decided by the address, see LangContext. */
export default async function HomePage() {
  const properties = await getOrderedPropertyCards();

  return (
    <main>
      <Navbar />
      <Hero />
      <Stats activeListings={properties.length} />
      <Services />
      <Certifications />
      <Featured properties={properties} />
      <About />
      <Location />
      <CoastVideos />
      <News />
      <Testimonials />
      <Associates />
      <Contact />
      <Footer />
    </main>
  );
}

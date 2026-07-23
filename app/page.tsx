import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Certifications from "./components/Certifications";
import Services from "./components/Services";
import Featured from "./components/Featured";
import About from "./components/About";
import Location from "./components/Location";
import News from "./components/News";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { getAllProperties, toCard, sortFeatured } from "./lib/easybroker";

export default async function Home() {
  const properties = sortFeatured((await getAllProperties()).map(toCard));

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
      <News />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}

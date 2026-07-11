import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Featured from "./components/Featured";
import About from "./components/About";
import Location from "./components/Location";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { getAllProperties, toCard } from "./lib/easybroker";

export default async function Home() {
  const properties = (await getAllProperties()).map(toCard);

  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Featured properties={properties} />
      <About />
      <Location />
      <Contact />
      <Footer />
    </main>
  );
}

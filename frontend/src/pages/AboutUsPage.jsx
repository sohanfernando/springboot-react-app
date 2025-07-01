import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa";

const AboutUsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 uppercase">
          FASHIONHUB - OUR STORY | STREETWEAR & LIFESTYLE BRAND IN SRI LANKA
        </h1>

        <section className="text-left space-y-6">
          <div>
            <h2 className="font-bold italic text-lg mb-2">FashionHub: Born from the Passion for Style</h2>
            <p>
              What started as a vision over a simple idea became a bold move toward creating standout, affordable streetwear.
              Since its launch, FashionHub has grown into a leading name in lifestyle fashion—catering to individuals who express
              identity through design, comfort, and confidence.
            </p>
            <p className="mt-2">
              Our logo represents individuality and bold spirit—at FashionHub, fashion isn’t just clothing, it’s a movement.
            </p>
          </div>

          <div>
            <h2 className="font-bold italic text-lg mb-2">Our Mission: Redefine Everyday Fashion</h2>
            <p>
              FashionHub is dedicated to helping you make a statement with what you wear. We focus on contemporary design,
              premium materials, and wearable comfort—because fashion should move with you, not restrict you.
            </p>
            <p className="mt-2">
              We are always evolving to keep our collections fresh, functional, and ready to wear anywhere—from streets to socials.
            </p>
          </div>

          <div>
            <h2 className="font-bold italic text-lg mb-2">Experience the Feel of Everyday Luxury</h2>
            <p>
              Our pieces are made with carefully selected fabrics, focused on breathable comfort and edgy aesthetics. Whether it’s
              laid-back loungewear or bold statement pieces, FashionHub lets you look and feel your best—effortlessly.
            </p>
          </div>

          <p className="italic mt-6">
            Join the FashionHub movement—where expression meets everyday style.
          </p>
        </section>

        <div className="flex justify-center gap-6 mt-10 text-2xl">
          <a href="#" className="hover:scale-110 transition"><FaInstagram /></a>
          <a href="#" className="hover:scale-110 transition"><FaTiktok /></a>
          <a href="#" className="hover:scale-110 transition"><FaLinkedin /></a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUsPage

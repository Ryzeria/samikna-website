import React from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Products from '../components/sections/Products';
import Specifications from '../components/sections/Specifications';
import MitraPartners from '../components/sections/MitraPartners';
import Testimonials from '../components/sections/Testimonials';
import DistributionMap from '../components/sections/DistributionMap';
import ContactInquiry from '../components/sections/ContactInquiry';

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>SAMIKNA - Sistem Aplikasi Monitoring Kesehatan Tanaman</title>
        <meta name="description" content="Solusi IoT terdepan untuk pertanian cerdas dan berkelanjutan. SAMIKNA membantu petani meningkatkan produktivitas dengan teknologi monitoring real-time, AI analytics, dan precision agriculture." />
        <meta name="keywords" content="SAMIKNA, IoT pertanian, smart farming, monitoring tanaman, precision agriculture, sensor tanah, weather station, teknologi pertanian, agritech Indonesia" />
        <meta name="author" content="SAMIKNA Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://samikna.id/" />
        <meta property="og:title" content="SAMIKNA - Sistem Aplikasi Monitoring Kesehatan Tanaman" />
        <meta property="og:description" content="Solusi IoT terdepan untuk pertanian cerdas dan berkelanjutan. Tingkatkan produktivitas pertanian dengan teknologi monitoring real-time." />
        <meta property="og:image" content="https://samikna.id/images/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://samikna.id/" />
        <meta property="twitter:title" content="SAMIKNA - Sistem Aplikasi Monitoring Kesehatan Tanaman" />
        <meta property="twitter:description" content="Solusi IoT terdepan untuk pertanian cerdas dan berkelanjutan. Tingkatkan produktivitas pertanian dengan teknologi monitoring real-time." />
        <meta property="twitter:image" content="https://samikna.id/images/twitter-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Indonesian" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Structured Data for SEO */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SAMIKNA",
              "description": "Sistem Aplikasi Monitoring Kesehatan Tanaman",
              "url": "https://samikna.id",
              "logo": "https://samikna.id/images/logo/samikna-logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Gedung Teknik Geomatika ITS, Kampus ITS Sukolilo",
                "addressLocality": "Surabaya",
                "addressRegion": "Jawa Timur",
                "postalCode": "60111",
                "addressCountry": "Indonesia"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+62-31-5994251",
                "contactType": "customer service",
                "email": "info@samikna.id"
              },
              "sameAs": [
                "https://facebook.com/samikna.id",
                "https://twitter.com/samikna_id",
                "https://instagram.com/samikna.id",
                "https://linkedin.com/company/samikna"
              ]
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero />
          
          {/* About Section */}
          <About />
          
          {/* Products Section */}
          <Products />
          
          {/* Specifications Section */}
          <Specifications />
          
          {/* Mitra Partners Section */}
          <MitraPartners />
          
          {/* Testimonials Section */}
          <Testimonials />
          
          {/* Distribution Map Section */}
          <DistributionMap />
          
          {/* Contact & Inquiry Section */}
          <ContactInquiry />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
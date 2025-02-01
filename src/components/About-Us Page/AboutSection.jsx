import React from "react";
export default function AboutSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-white mb-8 custom-about-us">
          ABOUT US
        </h1>
        <p className="text-gray-300 max-w-3xl mx-auto">Creative Computing Society (CCS) is one of the oldest and most respected societies at Thapar Institute of Engineering and Technology. With 20 years of experience, CCS strives to foster a vibrant technical community, promoting innovation and collaboration through events, projects, and cutting-edge technologies like our AI-powered photo drive platform.</p>
      </div>
    </section>
  );
}

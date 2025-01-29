"use client"
import React from 'react'
import { useRef, useEffect, useState } from "react";
import membersData from "./cores.json";

export default function Footer() {
  const sliderRef = useRef(null);
  const [members, setMembers] = useState(membersData);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId;

    const animate = () => {
      slider.scrollLeft += 1;
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <footer className="py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-white text-xl mb-8">
          MADE WITH <span className="text-red-500">❤️</span> BY CCS
        </p>
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-hidden pb-4"
          style={{
            pointerEvents: "none",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            width: "calc(100% + 2rem)",
            marginLeft: "-1rem",
            marginRight: "-1rem",
          }}
        >
          {members.length > 0 ? members.map((member, index) => (
            <div key={index} className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden">
              <img
                src={member.image}
                alt={`Member ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          )) : (
            <p className="text-white">Loading members...</p>
          )}
        </div>
      </div>
    </footer>
  );
}


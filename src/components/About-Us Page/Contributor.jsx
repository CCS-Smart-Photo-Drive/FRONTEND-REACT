import React, { useState, useEffect, useRef } from "react";

export default function Contributor() {
  const creatorRefs = useRef([]);

  const creators = [
    {
      name: "Jidugu Sriharisesh",
      image: "/Hari.jpg",
      description: "",
    },
    {
      name: "Aanchal Jain",
      image: "/Aanchal.jpg",
      description: "",
    },
    {
      name: "Aargh Rai",
      image: "/Aargh.jpg",
      description: "",
    },
    {
      name: "Prince Sharma",
      image: "/Prince.jpg",
      description: "",
    },
    {
      name: "Jai Bhasin",
      image: "/Jai.jpg",
      description: "",
    },
    {
      name: "",
      image: "/.jpg",
      description: "",
    },
  ];

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute("href");
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
      });
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", handleScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleScroll);
      });
    };
  }, []);

  useEffect(() => {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.classList.remove("lazy");
            observer.unobserve(image);
          }
        });
      });

      document
        .querySelectorAll("img.lazy")
        .forEach((img) => imageObserver.observe(img));
    }
  }, []);

  const handleCreatorHover = (index, isEnter) => {
    creatorRefs.current.forEach((creator, i) => {
      if (i !== index) {
        creator.style.opacity = isEnter ? "0.5" : "1";
        creator.style.transform = isEnter ? "scale(0.95)" : "scale(1)";
      }
    });
  };

  return (
    <section className="py-20 relative z-10 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-white text-center z-20 relative mb-8">
          CONTRIBUTORS
        </h2>
        <div className="rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Meet Our Creators
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 ">
            {creators.map((creator, index) => (
              <div
                key={index}
                ref={(el) => (creatorRefs.current[index] = el)}
                className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 group bg-gray-800"
                onMouseEnter={() => handleCreatorHover(index, true)}
                onMouseLeave={() => handleCreatorHover(index, false)}
              >
                <div className="relative pt-[100%] overflow-hidden">
                  <img
                    src={creator.image || "/placeholder.svg"}
                    alt={creator.name}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-30 lazy"
                    data-src={creator.image || "/placeholder.svg"}
                  />
                </div>
                <div className="absolute inset-0 bg-gray-600 bg-opacity-90 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto flex flex-col justify-center">
                  <h2 className="text-xl font-bold mb-2">{creator.name}</h2>
                  <p>{creator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

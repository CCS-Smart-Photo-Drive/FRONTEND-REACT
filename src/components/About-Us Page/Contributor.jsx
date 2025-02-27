// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";

// export default function Contributor() {
//   const creatorRefs = useRef([]);
//   const mentorRefs = useRef([]);

//   const contributors = {
//     creators: [
//       { name: "Jidugu Sriharisesh", image: "/Hari.jpg", description: "AI Model & Backend Developer" },
//       { name: "Aanchal Jain", image: "/Aanchal.jpg", description: "Frontend Developer" },
//       { name: "Aargh Rai", image: "/Aargh.jpg", description: "API Integration" },
//       { name: "Prince Sharma", image: "/Prince.jpg", description: "Frontend Developer" },
//       { name: "Shreyans Jain", image: "/Shreyans.jpg", description: "Frontend Developer" },
//       { name: "Jai Bhasin", image: "/Jai.jpg", description: "Backend Developer" },
//       { name: "Yuvraj Chawla", image: "/yuvraj.png", description: "Backend Developer" },

//     ],
//     mentors: [
//       { name: "Kanav Dhanda", image: "/kanav.jpeg", description: "" },
//       { name: "Sarthak Tyagi", image: "/sarthak.jpg", description: "" },
//       { name: "Sanyam Singh", image: "/sanyam.jpg", description: "" },
//     ],
//   };

//   const handleHover = (refs, index, isEnter) => {
//     refs.current.forEach((ref, i) => {
//       if (i !== index && ref) {
//         ref.style.opacity = isEnter ? "0.5" : "1";
//         ref.style.transform = isEnter ? "scale(0.95)" : "scale(1)";
//       }
//     });
//   };

//   return (
//     <div className="bg-gray-900 text-white py-20 px-4 container mx-auto min-w-full">
//       <h1 className="text-6xl font-bold text-center mb-12">CONTRIBUTORS</h1>
//       {Object.entries(contributors).map(([role, people]) => (
//         <section key={role} className="mb-16">
//           <h2 className="text-5xl font-bold text-center mb-8 relative z-20">
//             {role === "creators" ? "Meet Our Creators" : "Meet Our Mentors"}
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {people.map((person, index) => (
//               <motion.div
//                 key={index}
//                 ref={(el) => (role === "creators" ? (creatorRefs.current[index] = el) : (mentorRefs.current[index] = el))}
//                 className="relative overflow-hidden rounded-xl shadow-lg bg-gray-800 hover:shadow-2xl transition duration-300"
//                 whileHover={{ scale: 1.05 }}
//                 onMouseEnter={() => handleHover(role === "creators" ? creatorRefs : mentorRefs, index, true)}
//                 onMouseLeave={() => handleHover(role === "creators" ? creatorRefs : mentorRefs, index, false)}
//               >
//                 <div className="relative w-full h-60 md:h-72 lg:h-80">
//                   <img src={person.image} alt={person.name} className="absolute inset-0 w-full h-full object-cover object-centre rounded-t-xl" />
//                 </div>
//                 <div className="p-6 text-center">
//                   <h3 className="text-2xl font-semibold">{person.name}</h3>
//                   <p className="text-gray-400 mt-2">{person.description}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       ))}
//     </div>
//   );
// }

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";

export default function Contributor() {
  const creatorRefs = useRef([]);
  const mentorRefs = useRef([]);

  const contributors = {
    creators: [
      { name: "Jidugu Sriharisesh", image: "/Hari.jpg", description: "AI Model & Backend Developer", linkedin: "https://www.linkedin.com/in/jsrihari" },
      { name: "Aanchal Jain", image: "/Aanchal.jpg", description: "Frontend Developer", linkedin: "https://www.linkedin.com/in/anchalj04/" },
      { name: "Aargh Rai", image: "/Aargh.jpg", description: "API Integration", linkedin: "https://www.linkedin.com/in/aargh-rai" },
      { name: "Prince Sharma", image: "/Prince.jpg", description: "Frontend Developer", linkedin: "https://www.linkedin.com/in/prince-sharma-581828335/" },
      { name: "Shreyans Jain", image: "/Shreyans.jpg", description: "Frontend Developer", linkedin: "https://www.linkedin.com/in/shreyans-jain-sz0528/" },
      { name: "Jai Bhasin", image: "/Jai.jpg", description: "Backend Developer", linkedin: "https://www.linkedin.com/in/jai-bhasin-530087293/" },
      { name: "Yuvraj Chawla", image: "/yuvraj.png", description: "Backend Developer", linkedin: "https://www.linkedin.com/" },
    ],
    mentors: [
      { name: "Kanav Dhanda", image: "/kanav.jpeg", description: "", linkedin: "https://www.linkedin.com/in/kanav-dhanda-056766213/" },
      { name: "Sarthak Tyagi", image: "/sarthak.jpg", description: "", linkedin: "https://www.linkedin.com/in/sarthak-tyagi1/" },
      { name: "Sanyam Singh", image: "/sanyam.jpg", description: "", linkedin: "https://www.linkedin.com/in/sanyam-brar-8a7753210/" },
    ],
  };

  const handleHover = (refs, index, isEnter) => {
    refs.current.forEach((ref, i) => {
      if (i !== index && ref) {
        ref.style.opacity = isEnter ? "0.5" : "1";
        ref.style.transform = isEnter ? "scale(0.95)" : "scale(1)";
      }
    });
  };

  return (
    <div className="bg-gray-900 text-white py-20 px-4 container mx-auto min-w-full">
      <h1 className="text-6xl font-bold text-center mb-12">CONTRIBUTORS</h1>
      {Object.entries(contributors).map(([role, people]) => (
        <section key={role} className="mb-16">
          <h2 className="text-5xl font-bold text-center mb-8 relative z-20">
            {role === "creators" ? "Meet Our Creators" : "Meet Our Mentors"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {people.map((person, index) => (
              <motion.div
                key={index}
                ref={(el) => (role === "creators" ? (creatorRefs.current[index] = el) : (mentorRefs.current[index] = el))}
                className="relative overflow-hidden rounded-xl shadow-lg bg-gray-800 hover:shadow-2xl transition duration-300"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleHover(role === "creators" ? creatorRefs : mentorRefs, index, true)}
                onMouseLeave={() => handleHover(role === "creators" ? creatorRefs : mentorRefs, index, false)}
              >
                <div className="relative w-full h-60 md:h-72 lg:h-80">
                  <img src={person.image} alt={person.name} className="absolute inset-0 w-full h-full object-cover object-center rounded-t-xl" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold">{person.name}</h3>
                  <p className="text-gray-400 mt-2">{person.description}</p>
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center mt-3 text-teal-400 hover:text-teal-300 transition duration-300"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

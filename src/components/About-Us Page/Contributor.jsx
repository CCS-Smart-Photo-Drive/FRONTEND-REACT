import React, { useState, useEffect, useRef } from "react"

export default function Contributor() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const videoRefs = useRef([])
  const creatorRefs = useRef([])

  const creators = [
    {
      id: "creatorA",
      name: "Prince Sharma",
      image: "/PRINCE_SHARMA.jpg",
      description: "blah blah",
    },
    {
      id: "creatorB",
      name: "B",
      image: "/B.jpg",
      description: "blah blah",
    },
    {
      id: "creatorC",
      name: "C",
      image: "/C.jpg",
      description: "blah blah",
    },
    {
      id: "creatorD",
      name: "D",
      image: "/D.jpg",
      description: "blah blah",
    },
    {
      id: "creatorE",
      name: "E",
      image: "/E.jpg",
      description: "blah blah",
    },
    {
      id: "creatorF",
      name: "New Team Member",
      image: "/F.jpg",
      description: "blah blah",
    },
  ]

  useEffect(() => {
    showVideo(currentVideoIndex)
  }, [currentVideoIndex])

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault()
      const href = e.currentTarget.getAttribute("href")
      document.querySelector(href).scrollIntoView({
        behavior: "smooth",
      })
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", handleScroll)
    })

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleScroll)
      })
    }
  }, [])

  useEffect(() => {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target
            image.src = image.dataset.src
            image.classList.remove("lazy")
            observer.unobserve(image)
          }
        })
      })

      document.querySelectorAll("img.lazy").forEach((img) => imageObserver.observe(img))
    }
  }, [])

  const showVideo = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (i === index) {
        video.classList.add("active")
      } else {
        video.classList.remove("active")
      }
    })
  }

  const nextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoRefs.current.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videoRefs.current.length) % videoRefs.current.length)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleCreatorHover = (index, isEnter) => {
    creatorRefs.current.forEach((creator, i) => {
      if (i !== index) {
        creator.style.opacity = isEnter ? "0.5" : "1"
        creator.style.transform = isEnter ? "scale(0.95)" : "scale(1)"
      }
    })
  }

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-white text-center z-20 relative mb-8">CONTRIBUTORS</h2>
        <div className="rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Meet Our Creators</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {creators.map((creator, index) => (
              <div
                key={creator.id}
                ref={(el) => (creatorRefs.current[index] = el)}
                className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 group"
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
  )
}


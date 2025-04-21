"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

// Remplacez ces données par vos propres témoignages avec des photos réelles
const testimonials = [
  {
    id: 1,
    name: "Thomas Dubois",
    role: "Parent",
    content:
      "Mon fils a énormément progressé depuis qu'il a rejoint BEFA Academy. Les entraîneurs sont professionnels et attentifs aux besoins de chaque enfant.",
    avatar: "/images/testimonial-1.jpg", // Remplacez par le chemin de votre image
  },
  {
    id: 2,
    name: "Lucas Martin",
    role: "Joueur U12",
    content:
      "J'adore les entraînements à BEFA ! On apprend beaucoup de techniques et on s'amuse en même temps. Les coachs sont super sympas.",
    avatar: "/images/testimonial-2.jpg", // Remplacez par le chemin de votre image
  },
  {
    id: 3,
    name: "Sophie Leroy",
    role: "Parent",
    content:
      "BEFA Academy offre un environnement parfait pour le développement de ma fille. Elle a gagné en confiance et en compétences techniques.",
    avatar: "/images/testimonial-3.jpg", // Remplacez par le chemin de votre image
  },
]

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute -top-12 left-0 text-primary opacity-20">
        <Quote className="h-24 w-24" />
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-secondary p-8 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-6 h-20 w-20 overflow-hidden rounded-full border-4 border-primary/20">
              <Image
                src={testimonials[current].avatar || "/placeholder.svg?height=80&width=80"}
                alt={testimonials[current].name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mb-6 text-lg text-gray-300 md:text-xl">"{testimonials[current].content}"</p>
            <h4 className="text-lg font-bold text-white">{testimonials[current].name}</h4>
            <p className="text-sm text-primary">{testimonials[current].role}</p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${index === current ? "bg-primary w-6" : "bg-gray-600"}`}
              onClick={() => {
                setAutoplay(false)
                setCurrent(index)
              }}
            />
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

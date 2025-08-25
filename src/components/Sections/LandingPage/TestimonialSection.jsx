import React, { useState, useRef } from "react";

const testimonials = [
  {
    text: "Legal jargon felt like a maze until AI Lawyer guided me through it.",
    name: "Sarah Mitchell",
    role: "Freelancer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: "Drafting consumer complaint letters is now effortless and professional with AI Lawyer.",
    name: "Maria Davis",
    role: "Consumer Rights Advocate",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    text: "The litigation analysis feature helps me spot trends and prep smarter – it's a game-changer.",
    name: "Elizabeth Martin",
    role: "Litigation Lawyer",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    text: "As a law student, AI Lawyer makes case research and briefs way less overwhelming.",
    name: "Rebecca Adams",
    role: "Law Student",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    text: "The clause generator saves me hours—editing contracts has never been this smooth.",
    name: "Alexandra Johnson",
    role: "Contract Manager",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    text: "AI Lawyer streamlines my research and document work like a true assistant on call.",
    name: "Timothy Clark",
    role: "Attorney",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
  },
];

const TestimonialCard = ({ testimonial }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Handle mouse movement to update cursor position relative to the card
  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative p-[2px] rounded-2xl overflow-hidden group transition-shadow duration-300 w-[320px] max-w-full"
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle 10rem at ${mousePosition.x}px ${mousePosition.y}px,
          rgba(88, 28, 135, 0.3),
          rgba(107, 33, 168, 0.2),
          rgba(76, 69, 165, 0.1),
          rgba(76, 69, 165, 0))`,
        backgroundOrigin: 'padding-box',
        transition: 'background 400ms ease',
      }}
    >
      <div className="relative flex flex-col items-center justify-center bg-white dark:bg-black rounded-2xl p-4 text-center min-h-0 h-auto">
        <p className="text-gray-700 dark:text-gray-200 text-base mb-2">{testimonial.text}</p>
        <div className="flex items-center gap-2 mt-1 justify-center">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-neutral-700"
          />
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white text-sm">{testimonial.name}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialSection() {
  const testimonials1 = testimonials.slice(0, testimonials.length / 2);
  const testimonials2 = testimonials.slice(testimonials.length / 2);

  return (
    <section id="testimonials" className="w-full bg-white dark:bg-black py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="text-purple-600 dark:text-purple-300 text-sm sm:text-base mb-2 tracking-widest uppercase">Testimonials</span>
        <h2 className="text-gray-900 dark:text-white font-sans font-medium text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          WHAT SETS LAMIS AI<br className="hidden sm:block" />APART FOR USERS?
        </h2>
      </div>
      
      <div className="relative flex flex-col w-full gap-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-full flex-row items-center justify-center gap-8">
            <div className="animate-scroll-left flex w-max flex-row gap-8">
                {[...testimonials1, ...testimonials1, ...testimonials1].map((t, i) => <TestimonialCard testimonial={t} key={i} />)}
            </div>
        </div>
        <div className="flex w-full flex-row items-center justify-center gap-8">
            <div className="animate-scroll-right flex w-max flex-row gap-8">
                 {[...testimonials2, ...testimonials2, ...testimonials2].map((t, i) => <TestimonialCard testimonial={t} key={i} />)}
            </div>
        </div>
      </div>

      {/* Bottom fade-out overlay */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-16 z-20 bg-gradient-to-t from-white dark:from-black to-transparent" />

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-right {
            animation: scroll-right 60s linear infinite;
        }
      `}</style>
    </section>
  );
} 
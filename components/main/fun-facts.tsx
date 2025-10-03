"use client";

import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "@/lib/motion";

const FUN_FACTS = [
  {
    icon: "💻",
    fact: "I debug code faster when listening to lo-fi music",
    description: "There's something about those chill beats that helps me spot bugs in milliseconds!"
  },
  {
    icon: "🎨",
    fact: "I've designed over 50+ UI components in Figma",
    description: "From buttons to entire design systems, I love crafting pixel-perfect interfaces."
  },
  {
    icon: "☁️",
    fact: "I can spin up AWS infrastructure with my eyes closed",
    description: "Well, almost! EC2, S3, Lambda - they're like old friends to me now."
  },
  {
    icon: "🌙",
    fact: "My best coding sessions happen between 10 PM - 3 AM",
    description: "Night owl developer mode activated! The quieter the world, the louder my creativity."
  },
  {
    icon: "🚀",
    fact: "I've deployed projects to 4 different cloud platforms",
    description: "AWS, Vercel, Netlify, and Heroku - each has its own personality and quirks."
  },
  {
    icon: "🎯",
    fact: "I obsess over 1px alignment in my designs",
    description: "That tiny misalignment? It bothers me more than it should, and I will fix it!"
  }
];

export const FunFacts = () => {
  return (
    <section
      id="fun-facts"
      className="flex flex-col items-center justify-center py-20 relative overflow-hidden"
    >
      <motion.div
        variants={slideInFromTop}
        className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9] mb-8"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[13px]">Developer Insights</h1>
      </motion.div>

      <motion.h1
        variants={slideInFromLeft(0.5)}
        className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-8 text-center"
      >
        Fun Facts About Me
      </motion.h1>

      <motion.p
        variants={slideInFromRight(0.5)}
        className="text-lg text-gray-400 mb-10 max-w-[600px] text-center"
      >
        Beyond the code and pixels - here are some quirky things about my developer journey
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl px-10 w-full">
        {FUN_FACTS.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative bg-[#0C0C1D]/50 backdrop-blur-sm border border-[#7042f88b] rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                {item.fact}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {item.description}
              </p>
            </div>

            {/* Animated corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
    </section>
  );
};
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code, Component, Cpu, Gamepad2, Shield } from "lucide-react";
import Link from "next/link";
import ThreeCanvas from "@/components/ThreeCanvas";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center pt-24 pb-16 px-6 sm:px-12 md:px-24 overflow-hidden">
      <ThreeCanvas />
      
      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto w-full text-center mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full glass-panel text-sm font-medium tracking-wide text-gray-300"
        >
          Valuation ₹5.0 Cr • Operating Globally from Chennai
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          High-Fidelity <br className="hidden md:block" />
          <span className="gradient-text">Technical Production.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Bridging the gap between high-end entertainment (VFX & Web3 Gaming) and enterprise-grade VR simulations. A structured technical powerhouse powered by Next.js and Unreal Engine.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="#collaborate" className="bg-white text-black px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
            View Capabilities <ArrowRight size={18} />
          </Link>
          <Link href="/play" className="bg-indigo-500 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
            <Gamepad2 size={18} /> Play WebGPU Demo
          </Link>
          <Link href="https://capitalclub.one" target="_blank" className="glass-panel px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors w-full sm:w-auto">
            Enterprise Consulting
          </Link>
        </motion.div>
      </section>

      {/* Grid Features */}
      <section className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        <FeatureCard 
          icon={<Gamepad2 className="text-indigo-400" size={32} />}
          title="Unreal Engine Porting"
          description="Complex PC-to-Mobile porting and Web3 integration. Delivered scaling solutions for ShibMetaverse."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Cpu className="text-pink-400" size={32} />}
          title="Industrial VR & AI"
          description="High-value enterprise training simulators. Active partnerships with Foxconn and IVW Tech."
          delay={0.4}
        />
        <FeatureCard 
          icon={<Component className="text-teal-400" size={32} />}
          title="Cinematic VFX"
          description="Theatrical-grade Maya & Houdini pipelines operated by industry veterans with 20+ years of active experience."
          delay={0.6}
        />
      </section>

      {/* Stats/Credibility */}
      <section className="relative z-10 max-w-4xl mx-auto w-full glass-panel rounded-2xl p-8 md:p-12 text-center text-gray-300">
        <h2 className="text-2xl font-semibold text-white mb-6">The Studio by the Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="text-4xl font-bold text-white mb-2">980+</p>
            <p className="text-sm uppercase tracking-wider text-gray-400">Audited Technical Talent</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white mb-2">12+</p>
            <p className="text-sm uppercase tracking-wider text-gray-400">Global Corporate Partners</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white mb-2">₹5.0 Cr</p>
            <p className="text-sm uppercase tracking-wider text-gray-400">Pre-Money Valuation</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="glass-panel p-8 rounded-xl h-full flex flex-col items-start hover:bg-white/5 transition-colors group"
    >
      <div className="bg-white/5 p-3 rounded-lg mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}

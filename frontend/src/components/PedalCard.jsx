import React from 'react'
import { useNavigate } from 'react-router-dom'

export function PedalCard({ pedal }) {
  const navigate = useNavigate()
  if (!pedal) return null

  const type = (pedal.type || '').toLowerCase()
  const name = (pedal.name || '').toLowerCase()
  const category = (pedal.category?.name || pedal.category || '').toLowerCase()

  // Authentic Analog Pedal Color Themes & Styles
  const getAnalogTheme = () => {
    if (category.includes('distortion') || type.includes('distortion') || name.includes('distortion')) {
      return {
        chassis: 'bg-orange-600 text-black border-orange-500 shadow-orange-900/50',
        badge: 'DISTORTION',
        led: 'bg-red-600 shadow-[0_0_10px_#ef4444]',
        knobs: 3
      }
    }
    if (category.includes('overdrive') || type.includes('overdrive') || name.includes('overdrive') || name.includes('crunch')) {
      return {
        chassis: 'bg-lime-500 text-black border-lime-400 shadow-lime-900/50',
        badge: 'OVERDRIVE',
        led: 'bg-red-600 shadow-[0_0_10px_#ef4444]',
        knobs: 3
      }
    }
    if (category.includes('delay') || type.includes('delay') || type.includes('reverb') || name.includes('delay')) {
      return {
        chassis: 'bg-sky-500 text-black border-sky-400 shadow-sky-900/50',
        badge: 'DELAY / REVERB',
        led: 'bg-cyan-300 shadow-[0_0_10px_#22d3ee]',
        knobs: 3
      }
    }
    if (category.includes('modulation') || type.includes('chorus') || type.includes('phase') || type.includes('flanger')) {
      return {
        chassis: 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-fuchsia-900/50',
        badge: 'MODULATION',
        led: 'bg-purple-300 shadow-[0_0_10px_#d8b4fe]',
        knobs: 2
      }
    }
    if (category.includes('dynamic') || type.includes('compressor') || type.includes('wah') || type.includes('eq')) {
      return {
        chassis: 'bg-amber-400 text-black border-amber-300 shadow-amber-900/50',
        badge: 'DYNAMIC / FILTER',
        led: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
        knobs: 3
      }
    }
    return {
      chassis: 'bg-zinc-700 text-white border-zinc-600 shadow-zinc-900/50',
      badge: 'STOMPBOX',
      led: 'bg-red-500 shadow-[0_0_10px_#ef4444]',
      knobs: 3
    }
  }

  const theme = getAnalogTheme()

  return (
    <div 
      onClick={() => navigate(`/pedals/${pedal.id}`)}
      className="group flex flex-col justify-between w-full h-[320px] rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-2xl overflow-hidden p-2.5"
    >
      {/* 1. TOP METALLIC PANEL (IN/OUT & ROTARY KNOBS) */}
      <div className="w-full h-16 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-lg p-2 flex flex-col justify-between border border-zinc-800 shadow-inner">
        <div className="flex justify-between items-center text-[7px] font-mono text-zinc-400 px-1">
          <span className="font-bold text-zinc-300">OUT</span>
          <div className="flex items-center gap-1">
            <span className="text-[6px] tracking-widest text-zinc-500">CHECK</span>
            <div className={`w-2 h-2 rounded-full ${theme.led}`} />
          </div>
          <span className="font-bold text-zinc-300">IN</span>
        </div>
        
        {/* Rotary Knobs */}
        <div className="flex justify-around items-center px-1">
          {Array.from({ length: theme.knobs }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-b from-zinc-600 to-zinc-800 border border-zinc-500 flex items-center justify-center shadow-md relative">
                <div className="w-0.5 h-1.5 bg-zinc-200 absolute top-0 rounded-full" />
              </div>
              <span className="text-[5px] font-bold text-zinc-400 mt-0.5">
                {idx === 0 ? 'GAIN' : idx === 1 ? 'TONE' : idx === 2 ? 'LEVEL' : 'RATE'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CHASSIS BODY (Vibrant Analog Pedal Enclosure) */}
      <div className={`w-full flex-1 ${theme.chassis} border-2 p-3 flex flex-col justify-between shadow-lg rounded-md my-1.5 font-sans`}>
        <div className="flex justify-between text-[7px] font-black opacity-80 tracking-widest uppercase">
          <span>◀ OUTPUT</span>
          <span>INPUT ◀</span>
        </div>
        
        <div className="text-center my-auto px-1">
          <span className="text-[7px] font-mono tracking-widest uppercase opacity-90 block mb-1 font-extrabold">
            {theme.badge}
          </span>
          <h3 className="text-xs font-black leading-tight my-0.5 drop-shadow-sm truncate">
            {pedal.name}
          </h3>
          <p className="text-[8px] font-extrabold opacity-85 uppercase tracking-wider">
            {pedal.brand}
          </p>
        </div>

        <div className="text-center text-[7px] font-black tracking-widest uppercase opacity-80">
          {pedal.category?.name || pedal.category}
        </div>
      </div>

      {/* 3. RUBBERIZED FOOTSWITCH */}
      <div className="w-full h-12 bg-zinc-900 rounded-lg p-1.5 flex flex-col justify-between items-center border border-zinc-800">
        <div className="w-8 h-1 bg-zinc-700 rounded-full shadow-inner" />
        <div className="w-full h-5 bg-zinc-950 rounded flex items-center justify-center border border-zinc-800 group-hover:bg-zinc-800 transition-colors shadow-inner">
          <span className="text-[7px] font-black tracking-widest text-zinc-500 group-hover:text-amber-400">PRESS</span>
        </div>
      </div>
    </div>
  )
}
// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import apiClient from '../services/apiClient'

// const PEDAL_COLORS = [
//   '#ea580c', '#dc2626', '#0284c7', '#9333ea', '#059669', 
//   '#d97706', '#db2777', '#0891b2', '#4f46e5', '#65a30d'
// ]

// export default function PedalDetailPage() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [pedal, setPedal] = useState(null)

//   useEffect(() => {
//     apiClient.get(`/pedals/${id}`)
//       .then(res => {
//         setPedal(res.data?.data || res.data)
//       })
//       .catch(() => {
//         setPedal({
//           id,
//           name: `Pedal Model ${id}`,
//           brand: 'BOSS',
//           type: 'Distortion',
//           category: { name: 'Overdrive / Distortion' },
//           price: 79.99,
//           model: `Model-${id}`
//         })
//       })
//   }, [id])

//   if (!pedal) {
//     return (
//       <div className="p-8 bg-[#121212] min-h-screen text-zinc-400 flex items-center justify-center">
//         <p className="text-sm font-mono animate-pulse">Loading pedal configuration...</p>
//       </div>
//     )
//   }

//   const numericId = Number(pedal.id) || 1
//   const accent = PEDAL_COLORS[(numericId - 1) % PEDAL_COLORS.length]

//   return (
//     <div className="p-8 bg-[#121212] min-h-screen text-zinc-100 flex flex-col items-center">
      
//       {/* Back Button */}
//       <div className="w-full max-w-4xl flex justify-start mb-8">
//         <button 
//           onClick={() => navigate('/pedals')}
//           className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
//         >
//           ← Back to pedal library
//         </button>
//       </div>

//       <div className="w-full max-w-2xl flex flex-col items-center space-y-12">
        
//         {/* Header */}
//         <div className="text-center space-y-3">
//           <span className="text-xs font-mono text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
//             {pedal.brand || 'PEDAL'}
//           </span>
//           <h1 className="text-4xl font-black tracking-tight">{pedal.name}</h1>
//           <p className="text-2xl font-mono text-emerald-400 font-bold">${pedal.price || '79.99'}</p>
//         </div>

//         {/* Pedal Enclosure */}
//         <div
//           style={{
//             width: '100%',
//             maxWidth: '320px',
//             aspectRatio: '2 / 3.2',
//             backgroundColor: accent,
//             borderRadius: '16px',
//             position: 'relative',
//             boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2)`,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '24px 20px'
//           }}
//         >
//           {/* Corner Screws */}
//           {[{t:'16px',l:'16px'}, {t:'16px',r:'16px'}, {b:'16px',l:'16px'}, {b:'16px',r:'16px'}].map((pos, i) => (
//             <div key={i} style={{ position: 'absolute', top: pos.t, left: pos.l, right: pos.r, bottom: pos.b, width: '6px', height: '6px', borderRadius: '50%', background: '#333', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)' }} />
//           ))}

//           {/* TOP ROW: IN - LED - OUT */}
//           <div className="w-full flex justify-between items-center px-2 mt-2">
//             <span className="text-[10px] font-mono font-black text-white/50 tracking-wider">IN</span>
//             <div 
//               style={{
//                 width: '14px', height: '14px', borderRadius: '50%',
//                 backgroundColor: '#ef4444',
//                 boxShadow: '0 0 10px #ef4444, inset 0 2px 4px rgba(255,255,255,0.8)',
//                 border: '2px solid rgba(255,255,255,0.2)',
//               }}
//             />
//             <span className="text-[10px] font-mono font-black text-white/50 tracking-wider">OUT</span>
//           </div>

//           {/* KNOBS: 2x2 Grid */}
//           <div className="grid grid-cols-2 gap-x-12 gap-y-8 mt-6">
//             {[0, 1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="relative flex justify-center"
//                 style={{
//                   width: '44px', height: '44px', borderRadius: '50%',
//                   background: 'radial-gradient(circle at 35% 35%, #3f3f46, #111)',
//                   boxShadow: '0 6px 10px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
//                 }}
//               >
//                 {/* Knob Pointer Line */}
//                 <div 
//                   className="absolute w-full h-full"
//                   style={{ transform: `rotate(${i % 2 === 0 ? -45 : 45}deg)` }}
//                 >
//                   <div className="w-[3px] h-3 bg-white mx-auto mt-1 rounded-full" />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* CENTER TEXT */}
//           <div className="text-center w-full my-4 space-y-1">
//             <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-white/80 block">
//               {pedal.brand || 'PEDAL'}
//             </span>
//             <h2 className="text-xl font-black text-white uppercase tracking-wide px-2">
//               {pedal.name || `MODEL-${pedal.id}`}
//             </h2>
//           </div>

//           {/* FOOTSWITCH */}
//           <div
//             className="flex items-center justify-center mb-2 rounded-full relative"
//             style={{
//               width: '72px', height: '72px',
//               background: 'radial-gradient(circle at 40% 30%, #fff, #d4d4d8 20%, #71717a 70%, #3f3f46)',
//               boxShadow: '0 15px 25px rgba(0,0,0,0.6), inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.8)',
//               border: '1px solid rgba(0,0,0,0.2)'
//             }}
//           >
//             {/* Inner ring */}
//             <div className="w-14 h-14 rounded-full border border-black/10 shadow-inner" />
//           </div>
//         </div>

//         {/* Specs Grid */}
//         <div className="w-full bg-[#18181b] border border-zinc-800 rounded-2xl p-8 shadow-xl max-w-lg mt-8">
//           <h3 className="text-sm font-black text-center text-zinc-400 mb-6 uppercase tracking-widest">Pedal Specs</h3>
          
//           <div className="grid grid-cols-2 gap-y-6 gap-x-8">
//             <div className="text-center sm:text-right border-b border-zinc-800/50 pb-2">
//               <span className="block text-xs text-zinc-500 font-medium mb-1">Category</span> 
//               <span className="font-bold text-zinc-200 text-sm">{pedal.category?.name || pedal.category || 'Effects'}</span>
//             </div>
//             <div className="text-center sm:text-left border-b border-zinc-800/50 pb-2">
//               <span className="block text-xs text-zinc-500 font-medium mb-1">Type</span> 
//               <span className="font-bold text-zinc-200 text-sm">{pedal.type || 'Standard'}</span>
//             </div>
//             <div className="text-center sm:text-right">
//               <span className="block text-xs text-zinc-500 font-medium mb-1">Model</span> 
//               <span className="font-bold text-zinc-200 text-sm">{pedal.model || `Model-${pedal.id}`}</span>
//             </div>
//             <div className="text-center sm:text-left">
//               <span className="block text-xs text-zinc-500 font-medium mb-1">Status</span> 
//               <span className="font-bold text-emerald-400 text-sm flex items-center justify-center sm:justify-start gap-1">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
//               </span>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'

const PEDAL_COLORS = [
  '#ea580c', '#dc2626', '#0284c7', '#9333ea', '#059669', 
  '#d97706', '#db2777', '#0891b2', '#4f46e5', '#65a30d'
]

export default function PedalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pedal, setPedal] = useState(null)

  useEffect(() => {
    apiClient.get(`/pedals/${id}`)
      .then(res => {
        setPedal(res.data?.data || res.data)
      })
      .catch(() => {
        setPedal({
          id,
          name: `Pedal Model ${id}`,
          brand: 'BOSS',
          type: 'Distortion',
          category: { name: 'Overdrive / Distortion' },
          price: 79.99,
          model: `Model-${id}`
        })
      })
  }, [id])

  if (!pedal) {
    return (
      <div style={{ padding: '32px', backgroundColor: '#121212', minHeight: '100vh', color: '#a1a1aa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
        <p style={{ animation: 'pulse 1.5s infinite' }}>Loading pedal configuration...</p>
      </div>
    )
  }

  const numericId = Number(pedal.id) || 1
  const accent = PEDAL_COLORS[(numericId - 1) % PEDAL_COLORS.length]

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#121212', minHeight: '100vh', color: '#f4f4f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Back Button */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/pedals')}
          style={{ background: 'transparent', border: 'none', color: '#f59e0b', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
        >
          ← Back to library
        </button>
      </div>

      {/* Main Split Layout (Forced Side-by-Side) */}
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        minHeight: '75vh',
        gap: '40px'
      }}>
        
        {/* LEFT SIDE: Description & Specs */}
        <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <span style={{ 
            display: 'inline-block', alignSelf: 'flex-start', 
            fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold', 
            textTransform: 'uppercase', letterSpacing: '1px', 
            backgroundColor: `${accent}20`, color: accent, 
            padding: '6px 14px', borderRadius: '20px', border: `1px solid ${accent}40`,
            marginBottom: '16px'
          }}>
            {pedal.brand || 'PEDAL'}
          </span>
          
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 12px 0', lineHeight: '1.1', letterSpacing: '-1px' }}>
            {pedal.name}
          </h1>
          
          <p style={{ fontSize: '24px', fontFamily: 'monospace', color: '#10b981', fontWeight: 'bold', margin: '0 0 24px 0' }}>
            ${pedal.price || '79.99'}
          </p>

          <p style={{ color: '#a1a1aa', fontSize: '15px', lineHeight: '1.6', margin: '0 0 32px 0', maxWidth: '450px' }}>
            Experience premium tone with the {pedal.brand} {pedal.name}. Built for musicians who demand reliability and sonic excellence on stage or in the studio.
          </p>

          {/* Specs Grid */}
          <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '24px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>
              <span style={{ color: '#71717a', fontSize: '13px' }}>Category</span> 
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{pedal.category?.name || pedal.category || 'Effects'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>
              <span style={{ color: '#71717a', fontSize: '13px' }}>Type</span> 
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{pedal.type || 'Standard'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>
              <span style={{ color: '#71717a', fontSize: '13px' }}>Model</span> 
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{pedal.model || `Model-${pedal.id}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717a', fontSize: '13px' }}>Status</span> 
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Active
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The 3D Pedal */}
        <div style={{ flex: '1 1 50%', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '320px',
              aspectRatio: '2 / 3.2',
              backgroundColor: accent,
              borderRadius: '16px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: `
                0 30px 50px -12px rgba(0,0,0,0.9),
                0 10px 15px -5px rgba(0,0,0,0.7),
                inset 0 2px 4px rgba(255,255,255,0.4),
                inset 0 -8px 20px rgba(0,0,0,0.6),
                inset 4px 0 10px rgba(255,255,255,0.1),
                inset -4px 0 10px rgba(0,0,0,0.4)
              `,
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%)`,
            }}
          >
            {/* Corner Screws */}
            {[{t:'16px',l:'16px'}, {t:'16px',r:'16px'}, {b:'16px',l:'16px'}, {b:'16px',r:'16px'}].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', top: pos.t, left: pos.l, right: pos.r, bottom: pos.b, width: '8px', height: '8px', borderRadius: '50%', background: '#333', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.3)' }} />
            ))}

            {/* TOP ROW: IN - LED - OUT */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 8px', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '900', color: 'rgba(0,0,0,0.5)' }}>IN</span>
              <div 
                style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 12px #ef4444, inset 0 2px 4px rgba(255,255,255,0.8)',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              />
              <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '900', color: 'rgba(0,0,0,0.5)' }}>OUT</span>
            </div>

            {/* KNOBS: 2x2 Grid (Fixed inline styling to prevent stacking) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 50px', marginTop: '16px' }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #3f3f46, #111)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
                    position: 'relative', display: 'flex', justifyContent: 'center'
                  }}
                >
                  {/* Knob Pointer Line */}
                  <div 
                    style={{ position: 'absolute', width: '100%', height: '100%', transform: `rotate(${i % 2 === 0 ? -45 : 45}deg)` }}
                  >
                    <div style={{ width: '4px', height: '14px', backgroundColor: '#fff', margin: '4px auto 0', borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* CENTER TEXT */}
            <div style={{ textAlign: 'center', width: '100%', margin: '16px 0' }}>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold', color: 'rgba(0,0,0,0.6)', display: 'block', marginBottom: '4px' }}>
                {pedal.brand || 'PEDAL'}
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.4)', padding: '0 8px' }}>
                {pedal.name || `MODEL-${pedal.id}`}
              </h2>
            </div>

            {/* FOOTSWITCH */}
            <div
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 30%, #fff, #d4d4d8 20%, #71717a 70%, #3f3f46)',
                boxShadow: '0 15px 25px rgba(0,0,0,0.7), inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.8)',
                border: '1px solid rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '8px'
              }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
// import { useState } from 'react'
// import { PedalCard } from '../components/PedalCard'

// const MASSIVE_DEFAULT_PEDALS = Array.from({ length: 106 }, (_, index) => {
//   const id = String(index + 1)
//   const brands = ['BOSS', 'Ibanez', 'MXR', 'Electro-Harmonix', 'ProCo', 'Dunlop', 'Strymon', 'TC Electronic']
//   const brand = brands[index % brands.length]
  
//   let categoryName = 'Overdrive / Distortion'
//   let type = index % 2 === 0 ? 'Distortion' : 'Overdrive'
  
//   if (index % 4 === 1) {
//     categoryName = 'Delay / Reverb'
//     type = index % 2 === 0 ? 'Digital Delay' : 'Spring Reverb'
//   } else if (index % 4 === 2) {
//     categoryName = 'Modulation'
//     type = index % 2 === 0 ? 'Chorus' : 'Phaser'
//   } else if (index % 4 === 3) {
//     categoryName = 'Dynamic / Filter'
//     type = index % 2 === 0 ? 'Compressor' : 'Wah'
//   }

//   return {
//     id,
//     name: `${brand} ${type} ${id}`,
//     brand,
//     model: `Model-${id}`,
//     category: { name: categoryName },
//     type,
//     price: 49.99 + (index * 1.5),
//     status: 'Active'
//   }
// })

// const CATEGORIES = [
//   { label: 'All Pedals', value: 'all' },
//   { label: 'Distortion / Overdrive', value: 'distortion' },
//   { label: 'Delay / Reverb', value: 'delay' },
//   { label: 'Modulation', value: 'modulation' },
//   { label: 'Dynamic / Filter', value: 'dynamic' }
// ]

// export default function PedalLibraryPage() {
//   const [pedals] = useState(MASSIVE_DEFAULT_PEDALS)
//   const [search, setSearch] = useState('')
//   const [activeCategory, setActiveCategory] = useState('all')

//   const filteredPedals = pedals.filter(p => {
//     const searchTerm = search.toLowerCase()
//     const matchesSearch = 
//       (p.name && p.name.toLowerCase().includes(searchTerm)) || 
//       (p.brand && p.brand.toLowerCase().includes(searchTerm)) ||
//       (p.type && p.type.toLowerCase().includes(searchTerm))
    
//     const catName = String(p.category?.name || p.category || '').toLowerCase()
//     const typeName = String(p.type || '').toLowerCase()

//     let matchesCategory = true
//     if (activeCategory === 'distortion') {
//       matchesCategory = catName.includes('distortion') || catName.includes('overdrive') || typeName.includes('distortion') || typeName.includes('overdrive')
//     } else if (activeCategory === 'delay') {
//       matchesCategory = catName.includes('delay') || catName.includes('reverb') || typeName.includes('delay') || typeName.includes('reverb')
//     } else if (activeCategory === 'modulation') {
//       matchesCategory = catName.includes('modulation') || typeName.includes('chorus') || typeName.includes('phaser')
//     } else if (activeCategory === 'dynamic') {
//       matchesCategory = catName.includes('dynamic') || catName.includes('filter') || typeName.includes('compressor') || typeName.includes('wah')
//     }

//     return matchesSearch && matchesCategory
//   })

//   return (
//     <div className="p-8 space-y-6 bg-[#121212] min-h-screen text-zinc-100">
//       <div className="border-b border-zinc-800 pb-4">
//         <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">THE COLLECTION</span>
//         <h1 className="text-3xl font-extrabold mt-1">Pedal library</h1>
//         <p className="text-sm text-zinc-400 mt-1">Find your next sound by name, brand, or model.</p>
        
//         <div className="mt-4 flex items-center justify-between">
//           <span className="text-xs font-mono text-emerald-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 shadow-sm">
//             <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
//             {filteredPedals.length} pedals available
//           </span>
//         </div>
//       </div>

//       <input 
//         type="text"
//         placeholder="Search name, brand, or model..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
//       />

//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '8px' }}>
//         {CATEGORIES.map((cat) => {
//           const isActive = activeCategory === cat.value
//           return (
//             <button
//               key={cat.value}
//               onClick={() => setActiveCategory(cat.value)}
//               style={{
//                 padding: '10px 16px',
//                 borderRadius: '8px',
//                 fontSize: '12px',
//                 fontWeight: 'bold',
//                 cursor: 'pointer',
//                 border: isActive ? '1px solid #fbbf24' : '1px solid #3f3f46',
//                 backgroundColor: isActive ? '#f59e0b' : '#27272a',
//                 color: isActive ? '#09090b' : '#f4f4f5',
//               }}
//             >
//               {cat.label.toUpperCase()}
//             </button>
//           )
//         })}
//       </div>

//       {filteredPedals.length === 0 ? (
//         <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-zinc-800">
//           <p className="text-zinc-400 text-sm">Walang nahanap na pedal para sa kategoryang ito.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2">
//           {filteredPedals.map(pedal => (
//             <PedalCard key={pedal.id} pedal={pedal} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
import { useState } from 'react'
import { PedalCard } from '../components/PedalCard'

const MASSIVE_DEFAULT_PEDALS = Array.from({ length: 106 }, (_, index) => {
  const id = String(index + 1)
  const brands = ['BOSS', 'Ibanez', 'MXR', 'Electro-Harmonix', 'ProCo', 'Dunlop', 'Strymon', 'TC Electronic']
  const brand = brands[index % brands.length]

  let categoryName = 'Overdrive / Distortion'
  let type = index % 2 === 0 ? 'Distortion' : 'Overdrive'

  if (index % 4 === 1) {
    categoryName = 'Delay / Reverb'
    type = index % 2 === 0 ? 'Digital Delay' : 'Spring Reverb'
  } else if (index % 4 === 2) {
    categoryName = 'Modulation'
    type = index % 2 === 0 ? 'Chorus' : 'Phaser'
  } else if (index % 4 === 3) {
    categoryName = 'Dynamic / Filter'
    type = index % 2 === 0 ? 'Compressor' : 'Wah'
  }

  return {
    id,
    name: `${brand} ${type} ${id}`,
    brand,
    model: `Model-${id}`,
    category: { name: categoryName },
    type,
    price: 49.99 + (index * 1.5),
    status: 'Active'
  }
})

const CATEGORIES = [
  { label: 'All Pedals', value: 'all' },
  { label: 'Distortion / Overdrive', value: 'distortion' },
  { label: 'Delay / Reverb', value: 'delay' },
  { label: 'Modulation', value: 'modulation' },
  { label: 'Dynamic / Filter', value: 'dynamic' }
]

export default function PedalLibraryPage() {
  const [pedals] = useState(MASSIVE_DEFAULT_PEDALS)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredPedals = pedals.filter(p => {
    const searchTerm = search.toLowerCase()
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(searchTerm)) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm)) ||
      (p.type && p.type.toLowerCase().includes(searchTerm))

    const catName = String(p.category?.name || p.category || '').toLowerCase()
    const typeName = String(p.type || '').toLowerCase()

    let matchesCategory = true
    if (activeCategory === 'distortion') {
      matchesCategory = catName.includes('distortion') || catName.includes('overdrive') || typeName.includes('distortion') || typeName.includes('overdrive')
    } else if (activeCategory === 'delay') {
      matchesCategory = catName.includes('delay') || catName.includes('reverb') || typeName.includes('delay') || typeName.includes('reverb')
    } else if (activeCategory === 'modulation') {
      matchesCategory = catName.includes('modulation') || typeName.includes('chorus') || typeName.includes('phaser')
    } else if (activeCategory === 'dynamic') {
      matchesCategory = catName.includes('dynamic') || catName.includes('filter') || typeName.includes('compressor') || typeName.includes('wah')
    }

    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-8 space-y-6 bg-[#121212] min-h-screen text-zinc-100">
      <div className="border-b border-zinc-800 pb-4">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">THE COLLECTION</span>
        <h1 className="text-3xl font-extrabold mt-1">Pedal library</h1>
        <p className="text-sm text-zinc-400 mt-1">Find your next sound by name, brand, or model.</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-mono text-emerald-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            {filteredPedals.length} pedals available
          </span>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search name, brand, or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '8px' }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: isActive ? '1px solid #fbbf24' : '1px solid #3f3f46',
                backgroundColor: isActive ? '#f59e0b' : '#27272a',
                color: isActive ? '#09090b' : '#f4f4f5',
              }}
            >
              {cat.label.toUpperCase()}
            </button>
          )
        })}
      </div>

      {filteredPedals.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">Walang nahanap na pedal para sa kategoryang ito.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px', // Wider gap for the 3D drop shadows to breathe
            justifyContent: 'flex-start',
            paddingTop: '16px',
          }}
        >
          {filteredPedals.map(pedal => (
            <div key={pedal.id} style={{ width: '115px', flex: '0 0 auto' }}>
              <PedalCard pedal={pedal} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
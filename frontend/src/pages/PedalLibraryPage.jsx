import React, { useState } from 'react'
import { PedalCard } from '../components/PedalCard'

// Gihimo natong nagkalain-laing klase ang 103 ka pedals nga sakto sa ilang tagsa-tagsang kategorya
const ALL_103_PEDALS = Array.from({ length: 103 }, (_, i) => {
  const id = String(i + 1)
  const brands = ['BOSS', 'Ibanez', 'MXR', 'Electro-Harmonix', 'ProCo', 'Dunlop', 'Strymon', 'TC Electronic']
  const brand = brands[i % brands.length]
  
  let categoryName = 'Overdrive / Distortion'
  let subTypes = ['High Gain Distortion', 'Metal Distortion', 'Classic Overdrive', 'Fuzz Distortion', 'British Crunch']
  let subType = subTypes[i % subTypes.length]

  // Bahinon nato sila sa 4 ka kategorya nga limpyo ug walay sinagol
  if (i % 4 === 1) {
    categoryName = 'Delay / Reverb'
    const delayTypes = ['Analog Delay', 'Pingpong Delay', 'Digital Delay', 'Plate Reverb', 'Spring Reverb', 'Tape Echo']
    subType = delayTypes[i % delayTypes.length]
  } else if (i % 4 === 2) {
    categoryName = 'Modulation'
    const modTypes = ['Analog Chorus', 'Phase Shifter', 'Flanger', 'Tremolo', 'Vibrato', 'Rotary Speaker']
    subType = modTypes[i % modTypes.length]
  } else if (i % 4 === 3) {
    categoryName = 'Dynamic / Filter'
    const dynTypes = ['Optical Compressor', 'Crybaby Wah', 'Envelope Filter', 'Graphic EQ', 'Noise Gate']
    subType = dynTypes[i % dynTypes.length]
  }

  return {
    id,
    name: `${brand} ${subType}`,
    brand,
    model: `${subType} Model ${id}`,
    category: { name: categoryName },
    type: subType,
    price: 49.99 + (i * 1.5),
    status: 'Active'
  }
})

const CATEGORIES = [
  { label: 'All Pedals', value: 'all' },
  { label: 'Distortion / Overdrive', value: 'Overdrive / Distortion' },
  { label: 'Delay / Reverb', value: 'Delay / Reverb' },
  { label: 'Modulation', value: 'Modulation' },
  { label: 'Dynamic / Filter', value: 'Dynamic / Filter' }
]

export default function PedalLibraryPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // Strictly filter base sa gipili nga category button aron walay masagol
  const filteredPedals = ALL_103_PEDALS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase()) ||
                          p.type.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'all' || p.category?.name === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-8 space-y-6 bg-[#121212] min-h-screen text-zinc-100">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">THE COLLECTION</span>
          <h1 className="text-3xl font-extrabold mt-1">Pedal library</h1>
          <p className="text-sm text-zinc-400">Find your next sound by name, brand, or model.</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 shadow-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          {filteredPedals.length} pedals available
        </span>
      </div>

      {/* Search Input */}
      <input 
        type="text"
        placeholder="Search name, brand, or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
      />

      {/* Category Buttons */}
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

      {/* Grid Output */}
      {filteredPedals.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">Walang nahanap na pedal para sa kategoryang ito.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredPedals.map(pedal => (
            <PedalCard key={pedal.id} pedal={pedal} />
          ))}
        </div>
      )}
    </div>
  )
}
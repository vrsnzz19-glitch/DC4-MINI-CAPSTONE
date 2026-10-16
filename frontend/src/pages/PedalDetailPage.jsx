import { useNavigate, useParams } from 'react-router-dom'
import { PedalCard } from '../components/PedalCard'

const EXPANDED_DEFAULT_PEDALS = [
  { id: '1', name: 'DS-1 Distortion', brand: 'BOSS', model: 'DS-1', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 62.00, status: 'Active' },
  { id: '2', name: 'TS9 Tube Screamer', brand: 'Ibanez', model: 'TS9', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 99.99, status: 'Active' },
  { id: '3', name: 'Carbon Copy', brand: 'MXR', model: 'M169', category: { name: 'Delay / Reverb' }, type: 'Analog Delay', price: 149.99, status: 'Active' },
  { id: '4', name: 'CH-1 Super Chorus', brand: 'BOSS', model: 'CH-1', category: { name: 'Modulation' }, type: 'Chorus', price: 119.99, status: 'Active' },
  { id: '5', name: 'Metal Zone', brand: 'BOSS', model: 'MT-2', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 119.00, status: 'Active' },
  { id: '6', name: 'RV-6 Reverb', brand: 'BOSS', model: 'RV-6', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 169.00, status: 'Active' },
  { id: '7', name: 'Klon KTR', brand: 'Klon', model: 'KTR', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 3500.00, status: 'Active' },
  { id: '8', name: 'Morning Glory V4', brand: 'JHS Pedals', model: 'Morning Glory V4', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 229.00, status: 'Active' },
  { id: '9', name: 'Fulltone OCD', brand: 'Fulltone', model: 'OCD', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 179.00, status: 'Active' },
  { id: '10', name: 'SD-1 Super OverDrive', brand: 'BOSS', model: 'SD-1', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 64.99, status: 'Active' },
  { id: '11', name: 'TS808 Tube Screamer', brand: 'Ibanez', model: 'TS808', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 179.00, status: 'Active' },
  { id: '12', name: 'Maxon OD808', brand: 'Maxon', model: 'OD808', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 189.00, status: 'Active' },
  { id: '13', name: 'Guv\'nor', brand: 'Marshall', model: 'Guv\'nor', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 139.00, status: 'Active' },
  { id: '14', name: 'Soul Food', brand: 'Electro-Harmonix', model: 'Soul Food', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 89.00, status: 'Active' },
  { id: '15', name: 'RAT 2', brand: 'Pro Co', model: 'RAT 2', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 89.99, status: 'Active' },
  { id: '16', name: 'HM-2 Heavy Metal', brand: 'BOSS', model: 'HM-2', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 129.00, status: 'Active' },
  { id: '17', name: 'Distortion+', brand: 'MXR', model: 'M104', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 79.99, status: 'Active' },
  { id: '18', name: 'Big Muff Pi', brand: 'Electro-Harmonix', model: 'Big Muff Pi', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 99.00, status: 'Active' },
  { id: '19', name: 'Fuzz Face Mini Silicon', brand: 'Dunlop', model: 'FFM1', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 129.99, status: 'Active' },
  { id: '20', name: 'Tone Bender MKII', brand: 'JMI', model: 'Tone Bender MKII', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 249.00, status: 'Active' },
  { id: '21', name: 'Octavia', brand: 'Dallas-Arbiter', model: 'Octavia', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 199.00, status: 'Active' },
  { id: '22', name: 'Super Fuzz', brand: 'Shin-Ei', model: 'Super Fuzz', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 189.00, status: 'Active' },
  { id: '23', name: 'Germanium 4 Big Muff', brand: 'Electro-Harmonix', model: 'Germanium 4', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 119.00, status: 'Active' },
  { id: '24', name: 'Fuzz Face', brand: 'Dunlop', model: 'Fuzz Face', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 119.00, status: 'Active' },
  { id: '25', name: 'Tone Bender', brand: 'Sola Sound', model: 'Tone Bender', category: { name: 'Overdrive / Distortion' }, type: 'Fuzz', price: 229.00, status: 'Active' },
  { id: '26', name: 'DD-8 Digital Delay', brand: 'BOSS', model: 'DD-8', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 199.99, status: 'Active' },
  { id: '27', name: 'DD-7 Digital Delay', brand: 'BOSS', model: 'DD-7', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 169.99, status: 'Active' },
  { id: '28', name: 'DD-3 Digital Delay', brand: 'BOSS', model: 'DD-3', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 129.00, status: 'Active' },
  { id: '29', name: 'Carbon Copy Mini', brand: 'MXR', model: 'M301', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 139.00, status: 'Active' },
  { id: '30', name: 'Memory Man', brand: 'Electro-Harmonix', model: 'Memory Man', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 239.00, status: 'Active' },
  { id: '31', name: 'Memory Toy', brand: 'Electro-Harmonix', model: 'Memory Toy', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 89.00, status: 'Active' },
  { id: '32', name: 'Timeline', brand: 'Strymon', model: 'Timeline', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 449.00, status: 'Active' },
  { id: '33', name: 'Flashback Delay', brand: 'TC Electronic', model: 'Flashback', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 149.00, status: 'Active' },
  { id: '34', name: 'Echo Park', brand: 'TC Electronic', model: 'Echo Park', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 149.00, status: 'Active' },
  { id: '35', name: 'RV-5 Reverb', brand: 'BOSS', model: 'RV-5', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 199.99, status: 'Active' },
  { id: '36', name: 'BigSky Reverberator', brand: 'Strymon', model: 'BigSky', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 479.00, status: 'Active' },
  { id: '37', name: 'blueSky', brand: 'Strymon', model: 'blueSky', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 299.00, status: 'Active' },
  { id: '38', name: 'Hall of Fame 2', brand: 'TC Electronic', model: 'Hall of Fame 2', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 179.00, status: 'Active' },
  { id: '39', name: 'Holy Grail Neo', brand: 'Electro-Harmonix', model: 'Holy Grail Neo', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 139.00, status: 'Active' },
  { id: '40', name: 'Cathedral', brand: 'Electro-Harmonix', model: 'Cathedral', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 149.00, status: 'Active' },
  { id: '41', name: 'MXR Reverb', brand: 'MXR', model: 'Reverb', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 149.00, status: 'Active' },
  { id: '42', name: 'Hall of Fame Mini', brand: 'TC Electronic', model: 'Hall of Fame Mini', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 99.00, status: 'Active' },
  { id: '43', name: 'Flint', brand: 'Strymon', model: 'Flint', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 299.00, status: 'Active' },
  { id: '44', name: 'CE-2W Chorus', brand: 'BOSS', model: 'CE-2W', category: { name: 'Modulation' }, type: 'Chorus', price: 229.99, status: 'Active' },
  { id: '45', name: 'CH-1 Super Chorus', brand: 'BOSS', model: 'CH-1', category: { name: 'Modulation' }, type: 'Chorus', price: 119.99, status: 'Active' },
  { id: '46', name: 'Phase 90', brand: 'MXR', model: 'M101', category: { name: 'Modulation' }, type: 'Phaser', price: 99.99, status: 'Active' },
  { id: '47', name: 'Phase 100', brand: 'MXR', model: 'Phase 100', category: { name: 'Modulation' }, type: 'Phaser', price: 129.00, status: 'Active' },
  { id: '48', name: 'Small Stone Phaser', brand: 'Electro-Harmonix', model: 'Small Stone', category: { name: 'Modulation' }, type: 'Phaser', price: 99.00, status: 'Active' },
  { id: '49', name: 'Uni-Vibe', brand: 'MXR', model: 'M68', category: { name: 'Modulation' }, type: 'Chorus/Vibe', price: 199.00, status: 'Active' },
  { id: '50', name: 'Cry Baby Wah', brand: 'Dunlop', model: 'GCB95', category: { name: 'Modulation' }, type: 'Wah', price: 99.99, status: 'Active' },
  { id: '51', name: 'TR-2 Tremolo', brand: 'BOSS', model: 'TR-2', category: { name: 'Modulation' }, type: 'Tremolo', price: 119.99, status: 'Active' },
  { id: '52', name: 'Electric Mistress', brand: 'Electro-Harmonix', model: 'Deluxe Electric Mistress', category: { name: 'Modulation' }, type: 'Flanger', price: 159.00, status: 'Active' },
  { id: '53', name: 'BF-3 Flanger', brand: 'BOSS', model: 'BF-3', category: { name: 'Modulation' }, type: 'Flanger', price: 149.99, status: 'Active' },
  { id: '54', name: 'Vortex Flanger', brand: 'TC Electronic', model: 'Vortex', category: { name: 'Modulation' }, type: 'Flanger', price: 179.00, status: 'Active' },
  { id: '55', name: 'PH-3 Phase Shifter', brand: 'BOSS', model: 'PH-3', category: { name: 'Modulation' }, type: 'Phaser', price: 169.99, status: 'Active' },
  { id: '56', name: 'TU-3 Chromatic Tuner', brand: 'BOSS', model: 'TU-3', category: { name: 'Tuner' }, type: 'Tuner', price: 109.99, status: 'Active' },
  { id: '57', name: 'TU-2 Tuner', brand: 'BOSS', model: 'TU-2', category: { name: 'Tuner' }, type: 'Tuner', price: 119.00, status: 'Active' },
  { id: '58', name: 'PolyTune 3 Mini', brand: 'TC Electronic', model: 'PolyTune 3 Mini', category: { name: 'Tuner' }, type: 'Tuner', price: 99.00, status: 'Active' },
  { id: '59', name: 'Pitchblack', brand: 'Korg', model: 'Pitchblack', category: { name: 'Tuner' }, type: 'Tuner', price: 89.00, status: 'Active' },
  { id: '60', name: 'Pitchclip', brand: 'Korg', model: 'Pitchclip', category: { name: 'Tuner' }, type: 'Tuner', price: 29.99, status: 'Active' },
  { id: '61', name: 'StroboStomp', brand: 'Peterson', model: 'StroboStomp', category: { name: 'Tuner' }, type: 'Tuner', price: 229.00, status: 'Active' },
  { id: '62', name: 'GE-7 Graphic Equalizer', brand: 'BOSS', model: 'GE-7', category: { name: 'Equalizer' }, type: 'EQ', price: 129.99, status: 'Active' },
  { id: '63', name: 'EQ-200', brand: 'BOSS', model: 'EQ-200', category: { name: 'Equalizer' }, type: 'EQ', price: 199.99, status: 'Active' },
  { id: '64', name: '10-Band EQ', brand: 'MXR', model: 'M108S', category: { name: 'Equalizer' }, type: 'EQ', price: 119.00, status: 'Active' },
  { id: '65', name: 'M109 EQ', brand: 'MXR', model: 'M109', category: { name: 'Equalizer' }, type: 'EQ', price: 109.00, status: 'Active' },
  { id: '66', name: 'ParaEq', brand: 'Empress', model: 'ParaEq', category: { name: 'Equalizer' }, type: 'EQ', price: 299.00, status: 'Active' },
  { id: '67', name: 'Decimator II', brand: 'ISP Technologies', model: 'Decimator II', category: { name: 'Noise Gate' }, type: 'Noise Gate', price: 149.00, status: 'Active' },
  { id: '68', name: 'NS-2 Noise Suppressor', brand: 'BOSS', model: 'NS-2', category: { name: 'Noise Gate' }, type: 'Noise Gate', price: 119.99, status: 'Active' },
  { id: '69', name: 'NS-1X Noise Suppressor', brand: 'BOSS', model: 'NS-1X', category: { name: 'Noise Gate' }, type: 'Noise Gate', price: 149.99, status: 'Active' },
  { id: '70', name: 'Smart Gate', brand: 'MXR', model: 'M135', category: { name: 'Noise Gate' }, type: 'Noise Gate', price: 109.00, status: 'Active' },
  { id: '71', name: 'M136 Noise Gate', brand: 'MXR', model: 'M136', category: { name: 'Noise Gate' }, type: 'Noise Gate', price: 119.00, status: 'Active' },
  { id: '72', name: 'Dyna Comp', brand: 'MXR', model: 'M102', category: { name: 'Compressor' }, type: 'Compressor', price: 99.99, status: 'Active' },
  { id: '73', name: 'Compressor Plus', brand: 'Keeley', model: 'Compressor Plus', category: { name: 'Compressor' }, type: 'Compressor', price: 149.00, status: 'Active' },
  { id: '74', name: 'CS-3 Compression Sustainer', brand: 'BOSS', model: 'CS-3', category: { name: 'Compressor' }, type: 'Compressor', price: 109.99, status: 'Active' },
  { id: '75', name: 'Super Comp', brand: 'MXR', model: 'M133', category: { name: 'Compressor' }, type: 'Compressor', price: 109.00, status: 'Active' },
  { id: '76', name: 'White Finger', brand: 'Electro-Harmonix', model: 'White Finger', category: { name: 'Compressor' }, type: 'Compressor', price: 79.00, status: 'Active' },
  { id: '77', name: 'CP-1X Compressor', brand: 'BOSS', model: 'CP-1X', category: { name: 'Compressor' }, type: 'Compressor', price: 159.99, status: 'Active' },
  { id: '78', name: 'Orange Squeezer', brand: 'Dan Armstrong', model: 'Orange Squeezer', category: { name: 'Compressor' }, type: 'Compressor', price: 159.00, status: 'Active' },
  { id: '79', name: 'GEB-7 Bass EQ', brand: 'BOSS', model: 'GEB-7', category: { name: 'Bass' }, type: 'EQ', price: 129.99, status: 'Active' },
  { id: '80', name: 'Bass DI', brand: 'MXR', model: 'Bass DI', category: { name: 'Bass' }, type: 'DI', price: 179.00, status: 'Active' },
  { id: '81', name: 'Bass Big Muff Pi', brand: 'Electro-Harmonix', model: 'Bass Big Muff Pi', category: { name: 'Bass' }, type: 'Fuzz', price: 109.00, status: 'Active' },
  { id: '82', name: 'SCR-DDI', brand: 'Ampeg', model: 'SCR-DDI', category: { name: 'Bass' }, type: 'DI', price: 219.00, status: 'Active' },
  { id: '83', name: 'SansAmp Bass Driver', brand: 'Tech 21', model: 'SansAmp Bass Driver', category: { name: 'Bass' }, type: 'DI', price: 299.00, status: 'Active' },
  { id: '84', name: 'BD-2 Blues Driver', brand: 'BOSS', model: 'BD-2', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 119.99, status: 'Active' },
  { id: '85', name: 'OD-3 OverDrive', brand: 'BOSS', model: 'OD-3', category: { name: 'Overdrive / Distortion' }, type: 'Overdrive', price: 109.99, status: 'Active' },
  { id: '86', name: 'TightMetal', brand: 'Boss', model: 'TightMetal', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 119.00, status: 'Active' },
  { id: '87', name: 'RAT 3', brand: 'Pro Co', model: 'RAT 3', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 99.00, status: 'Active' },
  { id: '88', name: 'DS-2 Turbo Distortion', brand: 'BOSS', model: 'DS-2', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 79.99, status: 'Active' },
  { id: '89', name: 'Metal Core ML-2', brand: 'BOSS', model: 'ML-2', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 99.99, status: 'Active' },
  { id: '90', name: 'Metal Muff', brand: 'Electro-Harmonix', model: 'Metal Muff', category: { name: 'Overdrive / Distortion' }, type: 'Distortion', price: 109.00, status: 'Active' },
  { id: '91', name: 'CE-2 Chorus', brand: 'BOSS', model: 'CE-2', category: { name: 'Modulation' }, type: 'Chorus', price: 189.00, status: 'Active' },
  { id: '92', name: 'DC-2 Dimension C', brand: 'BOSS', model: 'DC-2', category: { name: 'Modulation' }, type: 'Chorus', price: 169.00, status: 'Active' },
  { id: '93', name: 'VB-2 Vibrato', brand: 'BOSS', model: 'VB-2', category: { name: 'Modulation' }, type: 'Vibrato', price: 179.00, status: 'Active' },
  { id: '94', name: 'RT-20 Rotary Ensemble', brand: 'BOSS', model: 'RT-20', category: { name: 'Modulation' }, type: 'Rotary', price: 249.00, status: 'Active' },
  { id: '95', name: 'SL-20 Slicer', brand: 'BOSS', model: 'SL-20', category: { name: 'Modulation' }, type: 'Slicer', price: 189.00, status: 'Active' },
  { id: '96', name: 'PS-6 Harmonist', brand: 'BOSS', model: 'PS-6', category: { name: 'Modulation' }, type: 'Pitch Shift', price: 219.00, status: 'Active' },
  { id: '97', name: 'OC-5 Super Octave', brand: 'BOSS', model: 'OC-5', category: { name: 'Modulation' }, type: 'Octave', price: 179.00, status: 'Active' },
  { id: '98', name: 'POG 2', brand: 'Electro-Harmonix', model: 'POG 2', category: { name: 'Modulation' }, type: 'Octave', price: 499.00, status: 'Active' },
  { id: '99', name: 'Micro POG', brand: 'Electro-Harmonix', model: 'Micro POG', category: { name: 'Modulation' }, type: 'Octave', price: 349.00, status: 'Active' },
  { id: '100', name: 'Harmonizer H9', brand: 'Eventide', model: 'H9', category: { name: 'Modulation' }, type: 'Multi-Effects', price: 449.00, status: 'Active' },
  { id: '101', name: 'TimeFactor', brand: 'Eventide', model: 'TimeFactor', category: { name: 'Delay / Reverb' }, type: 'Delay', price: 399.00, status: 'Active' },
  { id: '102', name: 'Space Reverb', brand: 'Eventide', model: 'Space', category: { name: 'Delay / Reverb' }, type: 'Reverb', price: 449.00, status: 'Active' },
  { id: '103', name: 'ModFactor', brand: 'Eventide', model: 'ModFactor', category: { name: 'Modulation' }, type: 'Multi-Effects', price: 399.00, status: 'Active' },
]

export default function PedalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pedal = EXPANDED_DEFAULT_PEDALS.find(p => p.id === String(id)) || EXPANDED_DEFAULT_PEDALS[0]

  return (
    <div className="p-8 space-y-6 bg-[#121212] min-h-screen text-zinc-100">
      <button onClick={() => navigate('/pedals')} className="text-sm text-amber-500 hover:underline">
        ← Back to library
      </button>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row gap-8 items-center max-w-2xl">
        <div className="w-48">
          <PedalCard pedal={pedal} />
        </div>
        <div className="space-y-3">
          <span className="text-xs font-bold text-amber-500 uppercase">{pedal.category?.name || 'Effect'}</span>
          <h1 className="text-3xl font-extrabold">{pedal.name}</h1>
          <p className="text-zinc-400 text-sm">{pedal.brand} · {pedal.model || pedal.type}</p>
          <p className="text-lg font-bold text-emerald-400">${Number(pedal.price || 99).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

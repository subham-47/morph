import React, { useState, useMemo, useRef, useEffect } from 'react'; // <-- Added useRef and useEffect
import { Link } from 'react-router-dom';
import { ChevronLeft, Microscope, RefreshCw, Sun, Moon, Info } from 'lucide-react';

const THIN_SECTIONS = [
  // ... (Keep your Quartz and Biotite exactly the same)
  {
    id: 'quartz',
    name: 'Quartz',
    rock: 'Granite',
    desc: 'Shows classic undulose (wavy) extinction in XPL. First-order gray/white interference colors.',
    extinctionAngle: 0, 
    isPleochroic: false,
    texturePPL: 'radial-gradient(circle at center, #f8f9fa 0%, #e9ecef 100%)',
    textureXPL: 'conic-gradient(from 0deg, #d1d5db, #f3f4f6, #9ca3af, #f3f4f6, #d1d5db)'
  },
  {
    id: 'plagioclase',
    name: 'Plagioclase Feldspar',
    rock: 'Gabbro',
    desc: 'Diagnostic polysynthetic twinning visible in XPL.',
    extinctionAngle: 30, 
    isPleochroic: false,
    imgPPL: '/minerals/plagioclase-ppl.jpg', 
    imgXPL: '/minerals/plagioclase-xpl.jpg',
    // 🚀 ADD YOUR VIDEO PATHS HERE! 
    // (If you only have one video for testing, just put the same path for both)
    videoPPL: '/minerals/plagioclase-spin-ppl.mp4', 
    videoXPL: '/minerals/plagioclase-spin-xpl.mp4'  
  }
];

export default function VirtualMicroscope() {
  const [activeId, setActiveId] = useState('quartz');
  const [rotation, setRotation] = useState(0);
  const [isXPL, setIsXPL] = useState(true);
  
  // 🚀 1. Create a reference to grab the video element
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeMineral = THIN_SECTIONS.find(m => m.id === activeId)!;

  // 🚀 2. THE VIDEO SCRUBBING ENGINE
  // Every time the rotation slider moves, this code runs!
  useEffect(() => {
    // Check if the video is loaded and ready
    if (videoRef.current && videoRef.current.duration) {
      // Math: (Current Slider Degree / 360) * Total Video Length in Seconds
      // Example: If slider is at 180 (halfway), and video is 10 seconds long... (180/360) * 10 = 5 seconds!
      const targetTime = (rotation / 360) * videoRef.current.duration;
      
      // Force the video to jump to that exact millisecond
      videoRef.current.currentTime = targetTime;
    }
  }, [rotation, activeId, isXPL]); // Run this when rotation, mineral, or light changes

  // (Your existing Image/CSS Optics Engine stays here to handle the fallback)
  const opticsStyle = useMemo(() => {
    const rad = (rotation - activeMineral.extinctionAngle) * (Math.PI / 180);
    const hasImage = !!activeMineral.imgPPL;
    const currentBg = hasImage 
      ? `url('${isXPL ? activeMineral.imgXPL : activeMineral.imgPPL}')`
      : (isXPL ? activeMineral.textureXPL : activeMineral.texturePPL);
    
    if (isXPL) {
      const intensity = Math.pow(Math.sin(2 * rad), 2);
      const opacity = Math.max(0.08, intensity); 
      return {
        backgroundImage: currentBg,
        backgroundSize: hasImage ? 'cover' : 'auto',
        backgroundPosition: 'center',
        opacity: opacity, 
        transform: `rotate(${rotation}deg)`
      };
    } else {
      return {
        backgroundImage: currentBg,
        backgroundSize: hasImage ? 'cover' : 'auto',
        backgroundPosition: 'center',
        opacity: 1,
        transform: `rotate(${rotation}deg)`
      };
    }
  }, [rotation, isXPL, activeMineral]);

  // Check if the current mineral has a video assigned
  const currentVideo = isXPL ? activeMineral.videoXPL : activeMineral.videoPPL;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-body flex flex-col md:flex-row">
      
      {/* ... (Your Left Panel Navigation Stays Exactly the Same) ... */}
      <div className="w-full md:w-1/3 border-r border-white/10 bg-slate-950/50 flex flex-col">
        {/* ... */}
      </div>

      {/* RIGHT PANEL: The Microscope Viewer */}
      <div className="w-full md:w-2/3 relative flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,#0f172a,#020617)]">
        
        {/* Main Stage Ring */}
        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-[16px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center bg-black overflow-hidden group">
          
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none z-30" />
          
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-40 mix-blend-difference">
            <div className="w-full h-[1px] bg-white" />
            <div className="h-full w-[1px] bg-white absolute" />
          </div>

          {/* 🚀 3. RENDER LOGIC: Show Video if it exists, otherwise show Image/CSS */}
          {currentVideo ? (
            <video 
              ref={videoRef}
              src={currentVideo}
              className="absolute w-full h-full object-cover scale-110" // scale-110 hides any weird video borders
              muted
              playsInline
              // We pause it initially because the slider controls the playback!
              onLoadedMetadata={() => { if (videoRef.current) videoRef.current.pause(); }} 
            />
          ) : (
            <div 
              className="absolute -inset-10 transition-all duration-100 ease-out"
              style={opticsStyle}
            />
          )}

        </div>

        {/* ... (Your Bottom Controls / Slider Stay Exactly the Same) ... */}

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

const menHeroImage = 'https://i.ibb.co/DHWwGw5S/Chat-GPT-Image-Jun-19-2026-04-11-34-AM-1.png';
const womenHeroImage = 'https://i.ibb.co/kVs0BzFN/Chat-GPT-Image-Jun-19-2026-04-11-35-AM-2.png';

const menImages = [
  "https://i.ibb.co/278Q2DPC/IMG-0799.jpg",
  "https://i.ibb.co/8g0KkztF/IMG-0798.jpg",
  "https://i.ibb.co/ZRRwrfTQ/IMG-0797.jpg",
  "https://i.ibb.co/LXNnBq47/IMG-0796.jpg",
  "https://i.ibb.co/C5MJVJx1/IMG-0795.jpg"
];

const womenImages = [
  "https://i.ibb.co/99BTMFFP/4-BA16-D5-B-B640-4990-AC88-8062-DEA6518-B.png",
  "https://i.ibb.co/xSPFxZhG/c15eac41-2d02-4fc6-a642-c88e2dcc08a2.jpg",
  "https://i.ibb.co/fcQTKDJ/IMG-0276.jpg",
  "https://i.ibb.co/nMJBTfV7/6d05695f-4e01-4de5-92d9-d76200814c95.jpg"
];

const glassCardStyle = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08)), radial-gradient(circle at 18% 12%, rgba(255, 255, 255, 0.45), transparent 32%), radial-gradient(circle at 85% 90%, rgba(255, 255, 255, 0.12), transparent 38%)',
  backdropFilter: 'blur(24px) saturate(140%)',
  WebkitBackdropFilter: 'blur(24px) saturate(140%)',
  border: '1px solid rgba(255, 255, 255, 0.32)',
};

interface PremiumSplitHeroProps {
  setCurrentTab: (tab: string) => void;
  language?: 'FR' | 'EN';
}

export default function PremiumSplitHero({ setCurrentTab, language = 'FR' }: PremiumSplitHeroProps) {
  const isFR = language === 'FR';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="relative w-full h-[440px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden select-none bg-[#F5F2ED]"
      id="premium-split-luxury-hero"
    >
      <div className="w-full h-full grid grid-cols-2 relative">
        {/* LEFT COLUMN: HOMME */}
        <div className="relative h-full overflow-hidden group">
          <img 
            src={menHeroImage}
            alt="Collection Homme"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark overlay for better reading and contrast */}
          <div className="absolute inset-0 bg-black/15 transition-opacity group-hover:bg-black/20 duration-500" />
          
          {/* Centered Tinted Card */}
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
            <div className="w-[90%] sm:w-[86%] md:w-[81%] lg:w-[79%] max-w-[425px] rounded-2xl p-3 sm:p-4 md:p-5 shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between relative overflow-hidden" style={glassCardStyle}>
              {/* Luxury Glass Reflections & Highlights */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.35),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              
              <div className="space-y-0.5 sm:space-y-1 relative z-10">
                <h2 className="text-xs sm:text-sm md:text-lg font-serif font-black text-[#1A1A2E] uppercase tracking-wider">
                  {isFR ? "COLLECTION HOMME" : "MEN'S COLLECTION"}
                </h2>
              </div>

              {/* Product Previews */}
              <div className="flex items-center justify-center my-3 sm:my-4 z-10" id="men-previews-container">
                <div className="w-[154px] sm:w-[178px] px-1 shrink-0 overflow-hidden">
                  <div 
                    className="flex flex-nowrap gap-2.5 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * (isMobile ? 78 : 90)}px)`
                    }}
                  >
                    {[...menImages, menImages[0]].map((img, idx) => (
                      <div 
                        key={idx} 
                        className="w-[68px] h-[85px] sm:w-[80px] sm:h-[100px] rounded-xl overflow-hidden bg-gray-100/50 border border-white/20 shadow-xs shrink-0"
                      >
                        <img 
                          src={img} 
                          className="w-full h-full object-cover object-center" 
                          alt="Short de bain Homme" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('hommes')}
                className="w-full text-[9px] sm:text-[10px] md:text-xs font-black bg-[#1A1A2E] text-white py-2 sm:py-2.5 md:py-3 px-3 rounded-xl uppercase tracking-widest hover:bg-[#FF7F50] active:scale-[0.98] transition-all cursor-pointer text-center block shadow-sm border border-transparent hover:shadow-md relative z-10"
                id="hommes-card-cta-btn"
              >
                {isFR ? "DÉCOUVRIR LES HOMMES" : "DISCOVER MEN"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FEMME */}
        <div className="relative h-full overflow-hidden group">
          <img 
            src={womenHeroImage}
            alt="Collection Femme"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark overlay */}
          <div className="absolute inset-0 bg-black/15 transition-opacity group-hover:bg-black/20 duration-500" />

          {/* Centered Tinted Card */}
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
            <div className="w-[90%] sm:w-[86%] md:w-[81%] lg:w-[79%] max-w-[425px] rounded-2xl p-3 sm:p-4 md:p-5 shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between relative overflow-hidden" style={glassCardStyle}>
              {/* Luxury Glass Reflections & Highlights */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.35),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
              
              <div className="space-y-0.5 sm:space-y-1 relative z-10">
                <h2 className="text-xs sm:text-sm md:text-lg font-serif font-black text-[#1A1A2E] uppercase tracking-wider">
                  {isFR ? "COLLECTION FEMME" : "WOMEN'S COLLECTION"}
                </h2>
              </div>

              {/* Product Previews */}
              <div className="flex items-center justify-center my-3 sm:my-4 z-10" id="women-previews-container">
                <div className="w-[154px] sm:w-[178px] px-1 shrink-0 overflow-hidden">
                  <div 
                    className="flex flex-nowrap gap-2.5 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * (isMobile ? 78 : 90)}px)`
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const img = womenImages[idx % womenImages.length];
                      return (
                        <div 
                          key={idx} 
                          className="w-[68px] h-[85px] sm:w-[80px] sm:h-[100px] rounded-xl overflow-hidden bg-gray-100/50 border border-white/20 shadow-xs shrink-0"
                        >
                          <img 
                            src={img} 
                            className="w-full h-full object-cover object-center" 
                            alt="" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('femmes')}
                className="w-full text-[9px] sm:text-[10px] md:text-xs font-black bg-[#1A1A2E] text-white py-2 sm:py-2.5 md:py-3 px-3 rounded-xl uppercase tracking-widest hover:bg-[#FF7F50] active:scale-[0.98] transition-all cursor-pointer text-center block shadow-sm border border-transparent hover:shadow-md relative z-10"
                id="femmes-card-cta-btn"
              >
                {isFR ? "DÉCOUVRIR LES FEMMES" : "DISCOVER WOMEN"}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM GRADIENT FADE OUT TO THE MAIN BODY CANVAS BEIGE COLOR (#F5F2ED) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED]/60 to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';

const menHeroImage = '/src/assets/images/hero_men_fashion_1780767862327.png';
const womenHeroImage = '/src/assets/images/hero_women_fashion_1780767878543.png';

const menImages = [
  "https://i.ibb.co/278Q2DPC/IMG-0799.jpg",
  "https://i.ibb.co/8g0KkztF/IMG-0798.jpg",
  "https://i.ibb.co/ZRRwrfTQ/IMG-0797.jpg",
  "https://i.ibb.co/LXNnBq47/IMG-0796.jpg",
  "https://i.ibb.co/C5MJVJx1/IMG-0795.jpg"
];

const womenImages = [
  "https://i.ibb.co/cKjZHyVm/BA1-BA1-E8-D417-4138-BC44-5428-D509-D96-A.png",
  "https://i.ibb.co/kgZfnhXb/0-D65587-F-6202-49-D2-828-D-D876-F623-F180.png",
  "https://i.ibb.co/G4BfK4xY/DBBDBA4-E-E753-4-A90-888-F-F0-A1-D804-E892.png",
  "https://i.ibb.co/spF9ZgKR/D063699-C-8-B0-D-4-C64-954-E-8-B7-F91224-AE6.png",
  "https://i.ibb.co/7tybsjgK/B696-EA52-9860-4-E52-A3-DE-CC4-BAB420-D04.png"
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
                          className="w-full h-full object-cover" 
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
                    {[...womenImages, womenImages[0]].map((img, idx) => (
                      <div 
                        key={idx} 
                        className="w-[68px] h-[85px] sm:w-[80px] sm:h-[100px] rounded-xl overflow-hidden bg-gray-100/50 border border-white/20 shadow-xs shrink-0"
                      >
                        <img 
                          src={img} 
                          className="w-full h-full object-cover" 
                          alt="" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    ))}
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

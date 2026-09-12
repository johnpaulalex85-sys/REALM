import React from 'react';
import { ArrowRight } from 'lucide-react';
import { soundFx } from '../sound';
import promoCliffImg from '../assets/images/promo_cliff_1789201593655.jpg';

interface PromoCardProps {
  onKeepGoing: () => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({ onKeepGoing }) => {
  return (
    <div className="relative w-full rounded-2xl p-6 overflow-hidden border border-purple-500/40 bg-gradient-to-b from-[#160b2e]/90 to-[#0c051a]/95 shadow-xl min-h-[175px] flex flex-col justify-end group">
      {/* Background artwork: Anime Wanderer on Cliff looking at Floating Spire Citadel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={promoCliffImg}
          alt="Hero Journey on Cliff"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_35%] filter saturate-125 opacity-65 transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090414] via-[#090414]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090414]/90 via-[#090414]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wider leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          SMALL STEPS.<br />
          BIGGER YOU.
        </h3>

        <div className="mt-4">
          <button
            id="keep-going-button"
            onClick={() => {
              soundFx.playClick();
              onKeepGoing();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-purple-100 font-extrabold text-xs tracking-wider uppercase border border-purple-500/60 shadow-[0_0_18px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>KEEP GOING</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-purple-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

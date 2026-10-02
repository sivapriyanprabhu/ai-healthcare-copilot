import React from 'react';

interface YogaPoseIllustrationProps {
  poseId?: string;
  className?: string;
  interactive?: boolean;
}

export const YogaPoseIllustration: React.FC<YogaPoseIllustrationProps> = ({
  poseId = 'tadasana',
  className = 'w-full h-44',
  interactive = false
}) => {
  const id = (poseId || 'tadasana').toLowerCase();

  // Color tokens
  const strokeColor = '#10b981'; // Emerald primary
  const accentColor = '#06b6d4'; // Cyan secondary
  const matColor = '#334155'; // Slate ground
  const breathColor = '#38bdf8'; // Sky breath pulse

  const renderIllustration = () => {
    switch (id) {
      case 'tadasana':
        return (
          <g>
            {/* Ground line */}
            <line x1="20" y1="170" x2="180" y2="170" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Vertical plumb alignment guide */}
            <line x1="100" y1="20" x2="100" y2="170" stroke="#334155" strokeDasharray="3 3" strokeWidth="1.5" opacity="0.6" />
            {/* Head */}
            <circle cx="100" cy="35" r="12" fill="none" stroke={strokeColor} strokeWidth="3" />
            {/* Torso / Spine */}
            <line x1="100" y1="47" x2="100" y2="105" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Arms by side */}
            <line x1="100" y1="58" x2="80" y2="100" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="58" x2="120" y2="100" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Legs */}
            <line x1="100" y1="105" x2="93" y2="170" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="100" y1="105" x2="107" y2="170" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Breath focal aura */}
            <circle cx="100" cy="70" r="14" fill={breathColor} fillOpacity="0.15" stroke={breathColor} strokeWidth="1" strokeDasharray="2 2" />
          </g>
        );

      case 'vrikshasana':
        return (
          <g>
            <line x1="20" y1="170" x2="180" y2="170" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="20" x2="100" y2="170" stroke="#334155" strokeDasharray="3 3" strokeWidth="1.5" opacity="0.4" />
            {/* Head */}
            <circle cx="100" cy="32" r="11" fill="none" stroke={strokeColor} strokeWidth="3" />
            {/* Torso */}
            <line x1="100" y1="43" x2="100" y2="98" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Anjali Mudra / Extended Arms */}
            <path d="M 100 55 Q 75 40 90 20" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 100 55 Q 125 40 110 20" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="18" r="4" fill={accentColor} />
            {/* Standing Leg (Left) */}
            <line x1="100" y1="98" x2="100" y2="170" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Bent Leg (Right) resting on inner thigh */}
            <line x1="100" y1="98" x2="132" y2="120" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="132" y1="120" x2="100" y2="128" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            {/* Center of balance point */}
            <circle cx="100" cy="98" r="4" fill="#f59e0b" />
          </g>
        );

      case 'bhujangasana':
        return (
          <g>
            <line x1="15" y1="150" x2="185" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Head lifted */}
            <circle cx="60" cy="65" r="11" fill="none" stroke={strokeColor} strokeWidth="3" />
            {/* Curved spine rising upward */}
            <path d="M 60 76 Q 80 115 125 145" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Legs on the ground extending back */}
            <line x1="125" y1="145" x2="175" y2="150" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Arms supporting chest */}
            <line x1="72" y1="95" x2="72" y2="150" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Thoracic expansion indicator */}
            <path d="M 50 85 Q 38 95 50 105" fill="none" stroke={breathColor} strokeWidth="2" strokeLinecap="round" />
            <circle cx="85" cy="100" r="12" fill={breathColor} fillOpacity="0.15" />
          </g>
        );

      case 'balasana':
        return (
          <g>
            <line x1="15" y1="150" x2="185" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Folded body curve */}
            <path d="M 65 145 Q 85 105 130 115 Q 155 120 155 145" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Head resting on mat */}
            <circle cx="55" cy="142" r="10" fill="none" stroke={strokeColor} strokeWidth="3" />
            {/* Arms reaching forward */}
            <line x1="80" y1="125" x2="25" y2="148" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Calming restorative aura */}
            <circle cx="110" cy="115" r="20" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeDasharray="2 2" />
          </g>
        );

      case 'adho_mukha_svanasana':
        return (
          <g>
            <line x1="15" y1="155" x2="185" y2="155" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Peak at Hips */}
            <circle cx="100" cy="55" r="5" fill="#f59e0b" />
            {/* Inverted V Torso and Arms */}
            <line x1="100" y1="55" x2="48" y2="155" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Head relaxed down */}
            <circle cx="62" cy="130" r="10" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Legs from hips to heels */}
            <line x1="100" y1="55" x2="155" y2="155" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Spinal elongation line */}
            <line x1="100" y1="55" x2="58" y2="120" stroke={accentColor} strokeWidth="2" strokeDasharray="3 3" />
          </g>
        );

      case 'setu_bandhasana':
        return (
          <g>
            <line x1="15" y1="150" x2="185" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Head & Shoulders grounded */}
            <circle cx="45" cy="140" r="10" fill="none" stroke={strokeColor} strokeWidth="3" />
            {/* Arching Bridge Torso */}
            <path d="M 55 142 Q 100 80 145 110" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Bent Legs down to grounded feet */}
            <line x1="145" y1="110" x2="150" y2="150" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Interlaced Arms on floor */}
            <line x1="60" y1="145" x2="120" y2="148" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Thyroid stimulation aura */}
            <circle cx="68" cy="130" r="8" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1" />
          </g>
        );

      case 'trikonasana':
        return (
          <g>
            <line x1="15" y1="160" x2="185" y2="160" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Legs forming wide base triangle */}
            <line x1="55" y1="160" x2="95" y2="90" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="145" y1="160" x2="95" y2="90" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Lateral Torso tilted */}
            <line x1="95" y1="90" x2="65" y2="115" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Head */}
            <circle cx="55" cy="110" r="9" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Bottom Arm to Shin */}
            <line x1="65" y1="115" x2="65" y2="155" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Top Arm extending to Sky */}
            <line x1="65" y1="115" x2="85" y2="40" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            <circle cx="85" cy="38" r="3" fill="#38bdf8" />
          </g>
        );

      case 'paschimottanasana':
        return (
          <g>
            <line x1="15" y1="150" x2="185" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Extended Legs */}
            <line x1="85" y1="148" x2="165" y2="148" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Spine folding forward over thighs */}
            <path d="M 85 148 Q 95 110 135 125" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Head near knees */}
            <circle cx="140" cy="122" r="9" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Arms holding toes */}
            <line x1="115" y1="120" x2="165" y2="142" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Pancreatic stimulation focal point */}
            <circle cx="105" cy="135" r="7" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" />
          </g>
        );

      case 'viparita_karani':
        return (
          <g>
            {/* Wall on the right */}
            <line x1="150" y1="20" x2="150" y2="160" stroke="#475569" strokeWidth="4" />
            <line x1="20" y1="150" x2="180" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Torso flat on mat */}
            <line x1="60" y1="148" x2="145" y2="148" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Head */}
            <circle cx="48" cy="145" r="10" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Arms resting open */}
            <line x1="85" y1="148" x2="75" y2="132" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Legs vertically up the wall */}
            <line x1="145" y1="148" x2="145" y2="45" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Venous flow downward arrow */}
            <path d="M 135 60 L 135 100 M 130 92 L 135 100 L 140 92" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'marjaryasana_bitilasana':
      case 'marjaryasana':
        return (
          <g>
            <line x1="15" y1="150" x2="185" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Cat Pose: Domed Arched Spine */}
            <path d="M 60 148 L 60 115 Q 100 65 140 115 L 140 148" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Head tucked down */}
            <circle cx="48" cy="125" r="9" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Arms straight down */}
            <line x1="60" y1="115" x2="60" y2="150" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Thighs vertical */}
            <line x1="140" y1="115" x2="140" y2="150" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Fluid spinal wave guide */}
            <path d="M 75 100 Q 100 80 125 100" fill="none" stroke={breathColor} strokeWidth="2" strokeDasharray="2 2" />
          </g>
        );

      case 'pavanamuktasana':
        return (
          <g>
            <line x1="15" y1="150" x2="185" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Back flat on mat */}
            <line x1="45" y1="148" x2="135" y2="148" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Head */}
            <circle cx="35" cy="144" r="9" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Knees hugged tightly to abdomen */}
            <path d="M 125 148 Q 135 105 100 100 Q 80 115 90 145" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Arms wrapped around shins */}
            <path d="M 65 140 Q 100 85 105 110" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Abdominal gas relief pulse */}
            <circle cx="95" cy="120" r="10" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" />
          </g>
        );

      case 'ardha_matsyendrasana':
        return (
          <g>
            <line x1="15" y1="155" x2="185" y2="155" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Seated base */}
            <line x1="65" y1="152" x2="135" y2="152" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Upright twisted spine */}
            <line x1="100" y1="152" x2="100" y2="70" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Head looking over shoulder */}
            <circle cx="104" cy="58" r="10" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Bent knee crossed over */}
            <path d="M 85 152 Q 120 110 115 152" fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            {/* Arm bracing against knee */}
            <line x1="100" y1="90" x2="122" y2="125" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Torso rotation spiral */}
            <path d="M 88 100 Q 100 90 112 100 Q 115 112 95 115" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );

      case 'anulom_vilom':
        return (
          <g>
            {/* Meditation Cushion */}
            <ellipse cx="100" cy="155" rx="55" ry="12" fill="#334155" opacity="0.7" />
            {/* Cross-legged base (Sukhasana) */}
            <path d="M 50 152 Q 100 135 150 152" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Perfectly erect meditation spine */}
            <line x1="100" y1="140" x2="100" y2="60" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Calm head */}
            <circle cx="100" cy="45" r="12" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Left hand in Gyan Mudra on knee */}
            <line x1="100" y1="80" x2="60" y2="135" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="58" cy="135" r="3" fill={accentColor} />
            {/* Right hand in Vishnu Mudra at nostrils */}
            <path d="M 100 80 Q 125 100 112 55" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Dual nostril alternating breath currents */}
            <path d="M 94 48 Q 80 40 85 25" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
            <path d="M 106 48 Q 120 40 115 25" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
          </g>
        );

      case 'surya_namaskar':
        return (
          <g>
            <line x1="15" y1="165" x2="185" y2="165" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Sun Salutation: Golden Solar Aura */}
            <circle cx="100" cy="70" r="38" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Standing arching back in Hastauttanasana */}
            <path d="M 95 165 L 95 105 Q 85 65 110 40" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            {/* Head arching backwards */}
            <circle cx="116" cy="38" r="9" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Arms extending upward and back */}
            <path d="M 95 85 Q 120 45 135 25" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            {/* Solar rays */}
            <line x1="100" y1="20" x2="100" y2="10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="140" y1="40" x2="150" y2="35" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <line x1="60" y1="40" x2="50" y2="35" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'shavasana':
      default:
        return (
          <g>
            <line x1="15" y1="150" x2="185" y2="150" stroke={matColor} strokeWidth="3" strokeLinecap="round" />
            {/* Completely relaxed body resting horizontally */}
            <line x1="50" y1="144" x2="165" y2="144" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            {/* Head supported gently */}
            <circle cx="40" cy="142" r="10" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Arms fallen open to side with palms up */}
            <line x1="75" y1="144" x2="75" y2="135" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Alpha/Theta brainwave oscillation */}
            <path d="M 25 125 Q 35 115 45 125 T 65 125" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            {/* Deep relaxation aura */}
            <ellipse cx="105" cy="144" rx="60" ry="16" fill="#10b981" fillOpacity="0.1" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-slate-900/80 border border-slate-700/60 overflow-hidden shadow-inner ${className}`}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Grid overlay for medical precision aesthetic */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      <svg
        viewBox="0 0 200 180"
        className="w-full h-full p-2 transition-transform duration-300 hover:scale-105 select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="poseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {renderIllustration()}
      </svg>

      {/* Pose identifier watermark pill */}
      <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider text-slate-400 bg-slate-800/80 border border-slate-700/50 uppercase">
        {id.replace(/_/g, ' ')}
      </div>
    </div>
  );
};

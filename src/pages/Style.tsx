export const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* --- Hero Section Mouse Spotlight Effect --- */
    .hero-bg {
      background-color: #f8fafc;
      background-image: 
        radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(13, 148, 136, 0.25), transparent 80%),
        radial-gradient(circle at 100% 0, #ccfbf1 0%, #f8fafc 40%),
        radial-gradient(circle at 0% 100%, #ccfbf1 0%, #f8fafc 30%);
      transition: background 0.6s ease-out;
    }
    
    /* --- Glossy Card Effect --- */
    .glass-card {
      background: rgba(255, 255, 255, 0.6);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
      transition: all 0.3s ease;
    }

    .glass-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 16px 40px 0 rgba(31, 38, 135, 0.15);
      background: rgba(255, 255, 255, 0.8);
    }
    
    /* --- Enhanced Primary Button --- */
    .primary-btn {
        background-image: linear-gradient(45deg, #14b8a6, #0d9488);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px -3px rgba(13, 148, 136, 0.3);
    }
    .primary-btn:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 10px 20px -5px rgba(13, 148, 136, 0.4);
    }

    /* --- Section Backgrounds for Glossy Effect --- */
    .section-bg {
      background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
    }

    /* --- Animation Keyframes --- */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes scroller {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    
    /* NEW: Text Reveal Animation */
    @keyframes reveal {
      from {
        clip-path: inset(0 100% 0 0);
      }
      to {
        clip-path: inset(0 0 0 0);
      }
    }

    /* --- Animation Utility Classes --- */
    .fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
    }

    .animate-scale-in {
      animation: scaleIn 0.7s ease-out forwards;
      opacity: 0;
    }
    
    .scroller {
      animation: scroller 40s linear infinite;
    }
    
    .scroller-container:hover .scroller {
      animation-play-state: paused;
    }

    /* NEW: Text Reveal Class */
    .text-reveal {
      animation: reveal 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
      animation-delay: inherit;
    }
    
    .feature-icon-hover:hover {
       transform: scale(1.1);
       filter: drop-shadow(0 0 15px rgba(13, 148, 136, 0.5));
    }

  `}</style>
);

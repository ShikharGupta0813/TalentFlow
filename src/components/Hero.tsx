export const Hero = () => {
  const trustedCompanies = [
    { name: "Microsoft", avatar: "M" },
    { name: "Google", avatar: "G" },
    { name: "Apple", avatar: "A" },
    { name: "Netflix", avatar: "N" },
    { name: "Spotify", avatar: "S" },
    { name: "Amazon", avatar: "A" },
    { name: "Meta", avatar: "M" },
  ];

  return (
    <section className="relative min-h-screen hero-bg text-stone-800 overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 z-10">
        <div className="text-3xl font-bold tracking-tight text-stone-900">TalentFlow</div>
        <a href="/dashboard">
          <button className="hidden sm:block primary-btn">
            Start
          </button>
        </a>
      </nav>

      {/* Hero Content */}
      <div className="flex-grow flex items-center px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 leading-tight mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-reveal inline-block" style={{ animationDelay: '0.5s' }}>Find Your Next</span><br /> 
            <span className="text-teal-600 text-reveal inline-block" style={{ animationDelay: '0.8s' }}>Talent</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 fade-in-up" style={{ animationDelay: '1s' }}>
            The all-in-one hiring platform designed to help you find, interview, and hire the best talent, faster than ever.
          </p>
          <div className="fade-in-up flex justify-center items-center gap-4" style={{ animationDelay: '1.2s' }}>
            <a href="/dashboard">
              <button className="primary-btn text-lg">
                Hiring Portal 
              </button>
            </a>
             <a href="/dashboard" className="sm:hidden">
                <button className="bg-white border border-stone-300 text-stone-700 font-semibold py-3 px-6 rounded-lg text-lg hover:bg-stone-50 transition-colors duration-300 shadow-sm">
                  Start Trial
                </button>
            </a>
          </div>
        </div>
      </div>

      {/* Trusted Companies Scroller */}
      <div className="px-6 lg:px-12 py-12 z-10">
          <div className="max-w-5xl mx-auto text-center fade-in-up" style={{ animationDelay: '1.4s' }}>
            <p className="text-stone-500 text-sm font-semibold tracking-wider mb-6">
              TRUSTED BY LEADING COMPANIES
            </p>
            <div className="scroller-container relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <div className="scroller flex items-center space-x-12">
                {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
                  <div key={index} className="flex-shrink-0 text-center group w-24">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2 mx-auto glass-card border-none group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                      <span className="text-2xl font-bold">{company.avatar}</span>
                    </div>
                    <p className="text-xs text-stone-500 font-semibold group-hover:text-teal-600 transition-colors duration-300">{company.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};
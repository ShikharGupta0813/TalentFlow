import { MapPin } from "lucide-react";

export const FeaturedJobs = () => {
    const candidates = [
        { name: "Sarah Chen", role: "Senior UI/UX Designer", location: "Remote", tags: ["Figma", "Prototyping"], avatarColor: "bg-teal-500" },
        { name: "Michael Rodriguez", role: "Frontend Developer", location: "San Francisco, CA", tags: ["React", "TypeScript"], avatarColor: "bg-sky-500" },
        { name: "Emily Johnson", role: "Product Manager", location: "New York, NY", tags: ["Strategy", "Analytics"], avatarColor: "bg-emerald-500" },
    ];
  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4 fade-in-up">
              Meet Top Talent
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
              A curated selection of pre-screened professionals ready for their next challenge.
            </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {candidates.map((candidate, index) => (
            <div 
              key={index} 
              className="glass-card rounded-2xl p-6 animate-scale-in"
              style={{ animationDelay: `${index * 100 + 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-5">
                <div className={`w-14 h-14 rounded-full ${candidate.avatarColor} flex-shrink-0 flex items-center justify-center text-xl font-bold text-white`}>
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-stone-900">{candidate.name}</h3>
                  <p className="text-stone-600">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center text-stone-500 text-sm space-x-4 mb-4">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" />{candidate.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map((tag, i) => (
                  <span key={i} className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

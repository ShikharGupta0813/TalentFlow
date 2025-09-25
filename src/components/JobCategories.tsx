import {Users,TrendingUp,Code,Heart,Shield,Wrench} from "lucide-react";

export const JobCategories = () => {
    const features = [
        { icon: Users, title: "AI Candidate Screening", description: "Smart resume analysis to find the best matches.", color: "text-teal-500", bgColor: "bg-teal-50" },
        { icon: TrendingUp, title: "Analytics Dashboard", description: "Real-time hiring insights and performance tracking.", color: "text-sky-500", bgColor: "bg-sky-50" },
        { icon: Code, title: "ATS Integration", description: "Seamlessly integrate with your existing applicant tracking system.", color: "text-emerald-500", bgColor: "bg-emerald-50" },
        { icon: Heart, title: "Video Interviews", description: "Conduct live or asynchronous video interviews on-platform.", color: "text-rose-500", bgColor: "bg-rose-50" },
        { icon: Shield, title: "Compliance Tools", description: "Ensure your hiring process is GDPR & EEOC compliant.", color: "text-amber-500", bgColor: "bg-amber-50" },
        { icon: Wrench, title: "Custom Workflows", description: "Tailor the hiring process to fit your company's unique needs.", color: "text-cyan-500", bgColor: "bg-cyan-50" },
    ];
  return (
    <section className="py-20 px-6 lg:px-12 section-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4 fade-in-up">
            A Smarter Way to Hire
          </h2>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
            Our powerful features are designed to streamline every step of your recruitment process, from sourcing to signing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 text-center glass-card rounded-2xl animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${feature.bgColor} mb-6 transition-all duration-300 feature-icon-hover`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
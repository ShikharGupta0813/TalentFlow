import { Star } from "lucide-react";
export const Footer = () => {
    const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "HR Director, TechCorp",
      avatarColor: "bg-teal-500",
      review: "TalentFlow has transformed our hiring process. The AI-powered matching is spot on and saves us hours of screening time.",
      rating: 5,
    },
    {
      id: 2,
      name: "David Chen",
      role: "Talent Manager, StartupXYZ", 
      avatarColor: "bg-sky-500",
      review: "The user-friendly interface and comprehensive candidate profiles make finding relevant applicants a breeze.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "People Ops, GrowthCo",
      avatarColor: "bg-emerald-500",
      review: "What sets TalentFlow apart is its commitment to support and the helpful, data-driven insights that improve our hiring decisions.",
      rating: 5,
    },
  ];

  return (
    <footer className="bg-white border-t border-stone-200">
      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-12 section-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4 fade-in-up">
              Loved by HR Teams Worldwide
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
              See what professionals are saying about our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="glass-card rounded-2xl p-8 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                 <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatarColor} flex-shrink-0 flex items-center justify-center text-lg font-bold text-white`}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">{testimonial.name}</h4>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer Links */}
      <section className="py-16 px-6 lg:px-12 bg-stone-100">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="md:col-span-1">
                  <h3 className="text-2xl font-bold mb-4">TalentFlow</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    A global leader in connecting HR teams with top talent. Our AI-powered platform simplifies recruitment.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="font-semibold mb-4 text-stone-800">Quick Links</h4>
                  <ul className="space-y-3 text-sm text-stone-500">
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Post Jobs</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Search Talent</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">About Us</a></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-semibold mb-4 text-stone-800">Resources</h4>
                  <ul className="space-y-3 text-sm text-stone-500">
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Integrations</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">API Access</a></li>
                  </ul>
                </div>

                 {/* Legal */}
                <div>
                  <h4 className="font-semibold mb-4 text-stone-800">Legal</h4>
                  <ul className="space-y-3 text-sm text-stone-500">
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Terms of Use</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Security</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Ad Choices</a></li>
                  </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="py-6 px-6 lg:px-12 bg-stone-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-stone-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TalentFlow. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-stone-500 text-sm">
            <a href="#" className="hover:text-teal-600 transition-colors">Facebook</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-teal-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
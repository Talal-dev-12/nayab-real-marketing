import { Shield, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-[#0f1e3d] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-red-400 font-semibold uppercase tracking-widest text-sm mb-2">
            Why Choose Us
          </p>
          <h2 className="text-4xl font-extrabold text-white">
            The Nayab Real Advantage
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Verified Properties",
              desc: "Every property is personally verified by our expert team for authenticity and legal clarity.",
            },
            {
              icon: TrendingUp,
              title: "Best Market Price",
              desc: "We ensure you get the best value for your investment with our market intelligence.",
            },
            {
              icon: Users,
              title: "Expert Agents",
              desc: "Our experienced agents guide you through every step of the buying or renting process.",
            },
            {
              icon: CheckCircle,
              title: "Legal Assistance",
              desc: "Complete documentation support for hassle-free property transactions.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-slate-800 rounded-xl p-6 text-center hover:bg-red-700 transition-colors duration-300 group cursor-default"
            >
              <div className="w-14 h-14 bg-red-700 group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <Icon
                  size={24}
                  className="text-white group-hover:text-red-700 transition-colors duration-300"
                />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 group-hover:text-white text-sm leading-relaxed transition-colors duration-300">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Home, Users, Award, MapPin } from "lucide-react";

export default function StatsBar() {
  return (
    <section className="bg-[#1a2e5a] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { icon: Home, value: "2,500+", label: "Total Properties" },
            { icon: Users, value: "200+", label: "Happy Clients" },
            { icon: Award, value: "18+", label: "Years Experience" },
            { icon: MapPin, value: "8", label: "Cities Covered" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="text-red-400" size={28} />
              <div className="text-3xl font-extrabold">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

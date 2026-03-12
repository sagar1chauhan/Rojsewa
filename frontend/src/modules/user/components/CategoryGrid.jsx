import { motion } from "framer-motion";
import {
  Scissors, Wrench, Zap, Droplets, Paintbrush, Home, Stethoscope,
  Car, Flower2, BookOpen, UtensilsCrossed, Truck, Shield, Baby,
  Hammer, Sparkles, Music, Camera, Dog, Building2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const defaultCategories = [
  { name: "Salon", icon: Scissors, color: "bg-pink-50 text-pink-600" },
  { name: "AC Repair", icon: Wrench, color: "bg-blue-50 text-blue-600" },
  { name: "Electrician", icon: Zap, color: "bg-yellow-50 text-yellow-700" },
  { name: "Plumber", icon: Droplets, color: "bg-cyan-50 text-cyan-600" },
  { name: "Painter", icon: Paintbrush, color: "bg-purple-50 text-purple-600" },
  { name: "Home Maint.", icon: Home, color: "bg-green-50 text-green-600" },
  { name: "Medical", icon: Stethoscope, color: "bg-red-50 text-red-600" },
  { name: "Mechanic", icon: Car, color: "bg-orange-50 text-orange-600" },
  { name: "Decoration", icon: Flower2, color: "bg-rose-50 text-rose-600" },
  { name: "Pandit", icon: BookOpen, color: "bg-amber-50 text-amber-700" },
  { name: "Catering", icon: UtensilsCrossed, color: "bg-emerald-50 text-emerald-600" },
  { name: "Transport", icon: Truck, color: "bg-slate-50 text-slate-600" },
  { name: "Security", icon: Shield, color: "bg-indigo-50 text-indigo-600" },
  { name: "Babysitter", icon: Baby, color: "bg-teal-50 text-teal-600" },
  { name: "Carpenter", icon: Hammer, color: "bg-stone-50 text-stone-600" },
  { name: "Cleaning", icon: Sparkles, color: "bg-sky-50 text-sky-600" },
  { name: "DJ/Events", icon: Music, color: "bg-violet-50 text-violet-600" },
  { name: "Photography", icon: Camera, color: "bg-fuchsia-50 text-fuchsia-600" },
  { name: "Pet Care", icon: Dog, color: "bg-lime-50 text-lime-600" },
  { name: "Real Estate", icon: Building2, color: "bg-zinc-50 text-zinc-600" },
];

const iconMap = {
  Salon: Scissors, "AC Repair": Wrench, Electrician: Zap, Plumber: Droplets, Painter: Paintbrush,
  "Home Maint.": Home, Medical: Stethoscope, Mechanic: Car, Decoration: Flower2, Pandit: BookOpen,
  Catering: UtensilsCrossed, Transport: Truck, Security: Shield, Babysitter: Baby, Carpenter: Hammer,
  Cleaning: Sparkles, "DJ/Events": Music, Photography: Camera, "Pet Care": Dog, "Real Estate": Building2
};

const CategoryGrid = ({ showAll = true }) => {
  const navigate = useNavigate();

  const savedCats = JSON.parse(localStorage.getItem("rozsewa_admin_categories") || "[]");
  const categories = savedCats.length > 0 ? savedCats.map(name => ({
    name,
    icon: iconMap[name] || Sparkles,
    color: defaultCategories.find(c => c.name === name)?.color || "bg-gray-50 text-gray-600"
  })) : defaultCategories;

  const items = showAll ? categories : categories.slice(0, 8);

  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-5 lg:grid-cols-10">
      {items.map((cat, i) => {
        const Icon = cat.icon;
        return (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            whileHover={{ y: -6, scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate(`/shops?category=${cat.name}`)}
            className="group flex flex-col items-center gap-1.5 rounded-2xl p-1 transition-shadow hover:shadow-md"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} transition-transform group-hover:scale-110`}>
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;

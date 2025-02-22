import Link from "next/link";
import {
  BriefcaseBusiness,
  Calendar1,
  CalendarClock,
  LucideLayoutDashboard,
  Settings,
  UserCheck2,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", icon: LucideLayoutDashboard, label: "Dashboard" },
  { href: "/citas", icon: CalendarClock, label: "Citas" },
  { href: "/clientes", icon: UserCheck2, label: "Clientes" },
  { href: "/servicios", icon: BriefcaseBusiness, label: "Servicios" },
  { href: "/config", icon: Settings, label: "Configuración" },
];

const Navbar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 hover:w-64 group transition-all duration-300 bg-white shadow-lg glow-effect">
      <nav className="h-full flex flex-col">
        {/* Logo/Brand */}
        <div className="p-4 flex items-center">
          <div className="w-8 h-8 flex items-center justify-center text-gray-700">
            <Calendar1 className="w-10 h-10 min-w-10 min-h-10 ml-4 text-violet-800" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Agenda+ <span className="text-sm text-gray-500">v1.0</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              passHref
              className="flex items-center gap-4 text-2xl p-3 py-3 text-gray-600 hover:bg-purple-300 rounded-lg transition-all duration-300 hover:shadow-md group"
            >
              <link.icon className="w-6 h-6 min-w-[2rem] min-h-[2rem]" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Navbar;

import { Outlet, NavLink } from 'react-router-dom';
import { Compass, Luggage } from 'lucide-react';

const tabs = [
  { to: '/', label: '일정 만들기', icon: Compass },
  { to: '/trips', label: '내 여행', icon: Luggage },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#EAF1F6]">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-[#F4F8FB] shadow-xl">
        <main className="flex-1 pb-24">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/90 backdrop-blur">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-400'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
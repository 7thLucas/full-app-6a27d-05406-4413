import { useState } from "react";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: "analyze" | "dashboard" | "library";
}

function MusicLogo() {
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    </div>
  );
}

const navItems = [
  {
    id: "analyze" as const,
    label: "Analyze",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    id: "dashboard" as const,
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    id: "library" as const,
    label: "Library",
    href: "/library",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
];

export function AppLayout({ children, activePage = "analyze" }: AppLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const { config, loading } = useConfigurables();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const appName = loading ? "Music Insight" : (config?.appName ?? "Music Insight Analyzer");

  return (
    <div className="min-h-screen flex" style={{ background: "#0F0F1A" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 border-r"
        style={{ background: "#0D0D1A", borderColor: "rgba(124,58,237,0.15)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "rgba(124,58,237,0.1)" }}>
          <MusicLogo />
          <div>
            <p className="text-sm font-bold text-white leading-tight">{appName}</p>
            {!loading && config?.tagline && (
              <p className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">{config.tagline}</p>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "text-white"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5",
                ].join(" ")}
                style={isActive ? { background: "rgba(124,58,237,0.2)", color: "#c4b5fd" } : {}}
              >
                <span className={isActive ? "text-[#a78bfa]" : ""}>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* User */}
        {isAuthenticated && user && (
          <div className="px-3 pb-4 border-t" style={{ borderColor: "rgba(124,58,237,0.1)" }}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg" style={{ background: "rgba(124,58,237,0.08)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}>
                {(user.username ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.username ?? user.email}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">{user.email}</p>
              </div>
              <form method="post" action="/auth/logout">
                <button type="submit" title="Sign out" className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20"
          style={{ background: "#0D0D1A", borderColor: "rgba(124,58,237,0.15)" }}
        >
          <div className="flex items-center gap-2.5">
            <MusicLogo />
            <span className="text-sm font-bold text-white">{appName}</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="text-[#94A3B8] hover:text-white p-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileNavOpen
                ? <path d="M18 6L6 18M6 6l12 12"/>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </header>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div
            className="lg:hidden border-b px-3 py-2"
            style={{ background: "#0D0D1A", borderColor: "rgba(124,58,237,0.15)" }}
          >
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={[
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive ? "text-[#c4b5fd]" : "text-[#94A3B8]",
                  ].join(" ")}
                  style={isActive ? { background: "rgba(124,58,237,0.2)" } : {}}
                  onClick={() => setMobileNavOpen(false)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              );
            })}
            {isAuthenticated && (
              <form method="post" action="/auth/logout" className="px-3 py-2">
                <button type="submit" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </form>
            )}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 border-t z-20 flex"
          style={{ background: "#0D0D1A", borderColor: "rgba(124,58,237,0.15)" }}
        >
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className="flex-1 flex flex-col items-center py-3 gap-1 text-[10px] font-medium transition-colors"
                style={{ color: isActive ? "#a78bfa" : "#94A3B8" }}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

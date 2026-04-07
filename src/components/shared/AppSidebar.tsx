import { cn } from '@/lib/utils';

export interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  onClick: () => void;
}

interface AppSidebarProps {
  items: NavItem[];
  activeKey?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export default function AppSidebar({
  items,
  activeKey,
  title = 'Gabinete Psicologico',
  subtitle = 'Panel de Administracion',
  footer,
}: AppSidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0 bg-[#0f172a] text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-lg font-extrabold tracking-tight uppercase">{title}</h1>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={item.onClick}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-bold',
                    isActive ? 'bg-white/20' : 'bg-slate-700'
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        {footer ?? (
          <div className="text-xs text-slate-500 text-center">UMSA - Gabinete Psicologico</div>
        )}
      </div>
    </aside>
  );
}

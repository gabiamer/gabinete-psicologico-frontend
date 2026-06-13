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
    <aside className="w-72 flex-shrink-0 bg-primary text-primary-foreground flex flex-col">
      <div className="p-6 border-b border-white/15">
        <div className="flex items-center gap-3 mb-1">
          <img src="/UCB LOGO ESCUDOpng.png" alt="UCB" className="h-10 w-10 object-contain flex-shrink-0" />
          <div>
            <h1 className="text-sm font-extrabold tracking-tight uppercase leading-tight">{title}</h1>
            <p className="text-xs text-primary-foreground/60 mt-0.5">{subtitle}</p>
          </div>
        </div>
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
                  ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
                  : 'text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-bold',
                    isActive ? 'bg-accent-foreground/20' : 'bg-white/15'
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/15">
        {footer ?? (
          <div className="text-xs text-primary-foreground/50 text-center">UCB Tarija — Gabinete Psicológico</div>
        )}
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

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
  const [sheetOpen, setSheetOpen] = useState(false);

  const navItems = (onItemClick?: () => void) =>
    items.map((item) => {
      const Icon = item.icon;
      const isActive = item.key === activeKey;
      return (
        <button
          key={item.key}
          onClick={() => {
            item.onClick();
            onItemClick?.();
          }}
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
    });

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-primary text-primary-foreground flex items-center h-14 px-4 shadow-md">
        <button
          onClick={() => setSheetOpen(true)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="flex-1 text-center text-sm font-extrabold tracking-tight uppercase">
          {title}
        </span>
        {/* Spacer to balance the hamburger button */}
        <div className="w-9" />
      </div>

      {/* Mobile Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-primary text-primary-foreground border-r-0">
          <SheetHeader className="p-6 border-b border-white/15">
            <div className="flex items-center gap-3">
              <img src="/UCB LOGO ESCUDOpng.png" alt="UCB" className="h-10 w-10 object-contain flex-shrink-0" />
              <div>
                <SheetTitle className="text-sm font-extrabold tracking-tight uppercase leading-tight text-primary-foreground">
                  {title}
                </SheetTitle>
                <p className="text-xs text-primary-foreground/60 mt-0.5">{subtitle}</p>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex-1 p-4 space-y-1">
            {navItems(() => setSheetOpen(false))}
          </nav>

          <div className="p-4 border-t border-white/15">
            {footer ?? (
              <div className="text-xs text-primary-foreground/50 text-center">UCB Tarija — Gabinete Psicológico</div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 bg-primary text-primary-foreground flex-col">
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
          {navItems()}
        </nav>

        <div className="p-4 border-t border-white/15">
          {footer ?? (
            <div className="text-xs text-primary-foreground/50 text-center">UCB Tarija — Gabinete Psicológico</div>
          )}
        </div>
      </aside>
    </>
  );
}

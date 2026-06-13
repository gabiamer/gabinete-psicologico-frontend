import { cn } from '@/lib/utils';

type ColorScheme = 'indigo' | 'emerald' | 'amber' | 'slate' | 'teal';

interface AccionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  colorScheme?: ColorScheme;
}

const colorMap: Record<ColorScheme, { bg: string; iconBg: string; iconColor: string; hover: string }> = {
  // Azul UCB
  indigo: {
    bg: 'bg-white border-primary/20 hover:border-primary/60',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    hover: 'hover:shadow-primary/10',
  },
  emerald: {
    bg: 'bg-white border-emerald-100 hover:border-emerald-400',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    hover: 'hover:shadow-emerald-100',
  },
  // Dorado UCB
  amber: {
    bg: 'bg-white border-accent/30 hover:border-accent/70',
    iconBg: 'bg-accent/15',
    iconColor: 'text-accent-foreground',
    hover: 'hover:shadow-accent/15',
  },
  slate: {
    bg: 'bg-white border-border hover:border-muted-foreground/40',
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
    hover: 'hover:shadow-muted',
  },
  teal: {
    bg: 'bg-white border-teal-100 hover:border-teal-400',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    hover: 'hover:shadow-teal-100',
  },
};

export default function AccionCard({
  icon: Icon,
  title,
  description,
  onClick,
  colorScheme = 'indigo',
}: AccionCardProps) {
  const colors = colorMap[colorScheme];

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-3 lg:gap-4 p-5 lg:p-8 rounded-xl lg:rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg text-center w-full',
        colors.bg,
        colors.hover
      )}
    >
      <div className={cn('h-12 w-12 lg:h-16 lg:w-16 rounded-xl lg:rounded-2xl flex items-center justify-center', colors.iconBg)}>
        <Icon className={cn('h-6 w-6 lg:h-8 lg:w-8', colors.iconColor)} />
      </div>
      <div>
        <p className="text-sm lg:text-lg font-extrabold text-foreground uppercase tracking-tight">{title}</p>
        <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1 hidden sm:block">{description}</p>
      </div>
    </button>
  );
}

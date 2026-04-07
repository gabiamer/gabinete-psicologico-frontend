import { cn } from '@/lib/utils';

type ColorScheme = 'indigo' | 'emerald' | 'amber' | 'slate';

interface AccionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  colorScheme?: ColorScheme;
}

const colorMap: Record<ColorScheme, { bg: string; iconBg: string; iconColor: string; hover: string }> = {
  indigo: {
    bg: 'bg-white border-indigo-100 hover:border-indigo-400',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    hover: 'hover:shadow-indigo-100',
  },
  emerald: {
    bg: 'bg-white border-emerald-100 hover:border-emerald-400',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    hover: 'hover:shadow-emerald-100',
  },
  amber: {
    bg: 'bg-white border-amber-100 hover:border-amber-400',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    hover: 'hover:shadow-amber-100',
  },
  slate: {
    bg: 'bg-white border-slate-200 hover:border-slate-400',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    hover: 'hover:shadow-slate-100',
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
        'flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg text-center w-full',
        colors.bg,
        colors.hover
      )}
    >
      <div className={cn('h-16 w-16 rounded-2xl flex items-center justify-center', colors.iconBg)}>
        <Icon className={cn('h-8 w-8', colors.iconColor)} />
      </div>
      <div>
        <p className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">{title}</p>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </button>
  );
}

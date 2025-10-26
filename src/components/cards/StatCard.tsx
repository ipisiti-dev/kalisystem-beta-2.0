import { Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useLongPress } from '@/hooks/use-long-press';

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  onAdd: () => void;
  onLongPress?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  onClick,
  onAdd,
  onLongPress,
  onContextMenu,
}: StatCardProps) {
  const longPressProps = onLongPress ? useLongPress({ onLongPress }) : {};

  return (
    <Card 
      className="p-4 bg-card border-border cursor-pointer hover:border-primary/30 transition-colors relative group"
      onClick={onClick}
      onContextMenu={onContextMenu}
      {...longPressProps}
      data-testid={`card-${label.toLowerCase()}`}
    >
      <div className="space-y-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
      <Button
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </Card>
  );
}
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, FileText, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/items', icon: Package, label: 'Items' },
  { path: '/order', icon: ShoppingCart, label: 'Order' },
  { path: '/bulk', icon: FileText, label: 'Dispatch' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function BurgerMenu() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Hide menu on manager view page
  if (location.pathname === '/manager-view') {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 bg-card/90 border border-border/50 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-card"
          data-testid="burger-menu-button"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-3 mt-8">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-2 ring-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
                data-testid={`nav-link-${label.toLowerCase()}`}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-all duration-200',
                  isActive && 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                )} />
                <span className="text-base font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

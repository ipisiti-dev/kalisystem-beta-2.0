// ...existing code...
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Upload, Database, Link } from 'lucide-react';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { getItem as kvGetItem, setItem as kvSetItem } from '@/lib/kvStorage';
import { useState, useEffect } from 'react';

// Persistent autosave setting key
const AUTOSAVE_KEY = 'autosave-enabled';

export default function Settings() {
  const navigate = useNavigate();
  const { exportData, importData, loadDefaultData, items, categories, suppliers, tags } = useApp();
  const [importUrl, setImportUrl] = useState('');
  // Autosave toggle state, enabled by default
  const [autosave, setAutosave] = useState<boolean>(true);

  // Hydrate autosave preference from persistent storage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await kvGetItem(AUTOSAVE_KEY);
        if (!mounted) return;
        if (stored === null) return; // keep default
        setAutosave(stored === 'true');
      } catch {
        // ignore, keep default
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Persist autosave setting
  useEffect(() => {
    (async () => {
      try {
        await kvSetItem(AUTOSAVE_KEY, autosave ? 'true' : 'false');
      } catch {
        // ignore
      }
    })();
  }, [autosave]);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tagcreator-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        importData(data);
        toast.success('Data imported successfully!');
      } catch (error) {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    input.click();
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to default data? This will clear all your current data.')) {
      storage.clearAll();
      loadDefaultData();
      toast.success('Reset to default data');
    }
  };

  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      const response = await fetch(importUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data from URL');
      }
      const data = await response.json();
      importData(data);
      toast.success('Data imported successfully from URL!');
      setImportUrl('');
    } catch (error) {
      toast.error('Failed to import data from URL. Check the URL and try again.');
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-2 bg-accent hover:bg-accent/80 active:bg-accent/60 text-accent-foreground transition-colors"
            onClick={() => navigate(-1)}
            aria-label="Back"
            data-testid="button-back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your data and preferences</p>

        {/* Stats */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold mb-3">Data Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{items.length}</p>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{categories.length}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{suppliers.length}</p>
              <p className="text-xs text-muted-foreground">Suppliers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-500">{tags.length}</p>
              <p className="text-xs text-muted-foreground">Tags</p>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold mb-3">Preferences</h3>
          <div className="flex items-center gap-4">
            <label htmlFor="autosave-toggle" className="flex items-center gap-2 cursor-pointer">
              <input
                id="autosave-toggle"
                type="checkbox"
                checked={autosave}
                onChange={e => setAutosave(e.target.checked)}
                className="accent-primary"
                data-testid="toggle-autosave"
              />
              <span className="font-medium">Autosave</span>
            </label>
            <span className="text-xs text-muted-foreground">Automatically save changes (persistent)</span>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-4 bg-card border-border">
          <h3 className="font-semibold mb-3">Data Management</h3>
          <div className="space-y-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-export"
            >
              <Download className="w-4 h-4" />
              Export Data (JSON)
            </Button>
            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-import"
            >
              <Upload className="w-4 h-4" />
              Import Data (JSON)
            </Button>
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/data.json"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="flex-1"
                  data-testid="input-import-url"
                />
                <Button
                  onClick={handleImportFromUrl}
                  variant="outline"
                  className="gap-2"
                  data-testid="button-import-url"
                >
                  <Link className="w-4 h-4" />
                  Import from URL
                </Button>
              </div>
            </div>
            <Button
              onClick={handleResetToDefault}
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-reset"
            >
              <Database className="w-4 h-4" />
              Reset to Default Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image, FileJson, Share2, Link } from 'lucide-react';
import { toast } from 'sonner';

interface ExportPanelProps {
  onExportImage?: () => void;
  onExportJSON?: () => void;
  onShare?: () => void;
  data?: any;
}

export const ExportPanel = ({ onExportImage, onExportJSON, onShare, data }: ExportPanelProps) => {
  const handleExportImage = () => {
    onExportImage?.();
    toast.success('Visualization exported as image');
  };

  const handleExportJSON = () => {
    if (data) {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-structure-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported as JSON');
    } else {
      onExportJSON?.();
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    onShare?.();
    toast.success('Link copied to clipboard');
  };

  return (
    <Card className="glass border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Export</CardTitle>
        </div>
        <CardDescription>Export or share your visualization</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start border-primary/20 hover:bg-primary/10"
          onClick={handleExportImage}
        >
          <Image className="h-4 w-4 mr-2 text-primary" />
          Export as Image (PNG)
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-primary/20 hover:bg-secondary/10"
          onClick={handleExportJSON}
        >
          <FileJson className="h-4 w-4 mr-2 text-secondary" />
          Export as JSON
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-primary/20 hover:bg-accent/10"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2 text-accent" />
          Share Link
        </Button>

        <div className="pt-3 border-t border-primary/20">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Link className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Exports include the current state of your data structure. 
              Images are high-resolution and suitable for presentations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

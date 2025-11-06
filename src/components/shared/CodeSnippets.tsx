import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export interface CodeExample {
  language: string;
  code: string;
  icon?: string;
}

interface CodeSnippetsProps {
  title: string;
  description: string;
  examples: CodeExample[];
}

export const CodeSnippets = ({ title, description, examples }: CodeSnippetsProps) => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);

  const handleCopy = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    setCopiedLang(language);
    toast.success(`${language} code copied to clipboard`);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  return (
    <Card className="glass border-primary/20 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <Tabs defaultValue={examples[0]?.language} className="flex-1 flex flex-col">
          <TabsList className="glass w-full justify-start">
            {examples.map((example) => (
              <TabsTrigger key={example.language} value={example.language}>
                {example.icon} {example.language}
              </TabsTrigger>
            ))}
          </TabsList>

          {examples.map((example) => (
            <TabsContent 
              key={example.language} 
              value={example.language}
              className="flex-1 flex flex-col mt-4"
            >
              <div className="relative flex-1 flex flex-col">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(example.code, example.language)}
                  className="absolute top-2 right-2 z-10 border-primary/20"
                >
                  {copiedLang === example.language ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <pre className="flex-1 rounded-lg bg-muted/50 p-4 overflow-auto font-mono text-xs border border-primary/20">
                  <code className="text-foreground">{example.code}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

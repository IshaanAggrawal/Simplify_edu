import Link from 'next/link';
import { Navbar } from '../../components/ui/navbar';
import { Footer } from '../../components/ui/footer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { PATTERNS_LIST } from '../../data/patterns';

export default function PatternsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-4">Pattern Library</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl text-lg">
            Master the core patterns that cover 90% of coding interview problems. Browse interactive animations of standard solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PATTERNS_LIST.map((pattern) => (
            <Link key={pattern.id} href={`/patterns/${pattern.id}`} className="block group">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{pattern.category}</Badge>
                    <Badge 
                      variant={pattern.difficulty === 'Easy' ? 'success' : pattern.difficulty === 'Medium' ? 'warning' : 'error'}
                    >
                      {pattern.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-[var(--color-accent)] transition-colors">
                    {pattern.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {pattern.when_to_use}
                  </p>
                  <div className="mt-6 text-sm font-medium text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    Animate Pattern &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

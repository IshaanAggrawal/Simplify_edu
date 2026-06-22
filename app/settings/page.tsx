import { Navbar } from '../../components/ui/navbar';

export default function ScaffoldPage() {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-64px)]">
        <h1 className="text-2xl font-mono text-[var(--color-text-muted)]">Page coming soon</h1>
      </div>
    </>
  );
}

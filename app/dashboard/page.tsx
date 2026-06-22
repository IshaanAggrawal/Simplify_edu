import { redirect } from 'next/navigation';
import { Navbar } from '../../components/ui/navbar';
import { Footer } from '../../components/ui/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { syncUser, getUserDashboardData } from '../../lib/db/actions';
import { PLAN_LIMITS } from '../../lib/stripe';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await syncUser();
  
  if (!user) {
    redirect('/'); // Alternatively, redirect to sign-in
  }

  const { recentVisualizations, runsToday } = await getUserDashboardData(user.id);

  const maxRuns = PLAN_LIMITS[user.plan] || 3;
  const runsRemaining = Math.max(0, maxRuns - runsToday);
  const usagePercentage = Math.min(100, Math.round((runsToday / maxRuns) * 100));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
            <p className="text-[var(--color-text-secondary)]">Manage your visualizations and track your usage.</p>
          </div>
          <Link href="/app">
            <Button>New Visualization &rarr;</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Usage Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daily Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-mono font-medium">{runsToday}</span>
                <span className="text-[var(--color-text-muted)]">/ {maxRuns} traces run today</span>
              </div>
              
              {/* Usage Meter */}
              <div className="w-full h-2 bg-[var(--color-bg-elevated)] rounded-full mt-4 mb-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${usagePercentage > 90 ? 'bg-red-500' : 'bg-[var(--color-accent)]'}`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <span className={`text-sm ${runsRemaining === 0 ? 'text-red-500 font-semibold' : 'text-[var(--color-text-secondary)]'}`}>
                  {runsRemaining} runs remaining
                </span>
                {user.plan === 'free' && (
                  <Link href="/pricing" className="text-sm text-[var(--color-accent)] hover:underline">
                    Upgrade to Pro
                  </Link>
                )}
                {user.plan === 'pro' && runsRemaining === 0 && (
                  <Link href="/pricing" className="text-sm text-[var(--color-accent)] hover:underline">
                    Get Pro Max
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Card */}
          <Card className={user.plan !== 'free' ? 'border-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/10' : ''}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                Current Plan
                {user.plan !== 'free' && <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" title="Active" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="capitalize text-2xl font-semibold">{user.plan.replace('_', ' ')}</span>
                <Badge variant={user.plan !== 'free' ? 'success' : 'default'}>
                  {user.plan === 'free' ? 'Basic Features' : 'Premium Active'}
                </Badge>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {user.plan === 'free' 
                  ? 'Upgrade to get up to 50 AI animations and chat capabilities.' 
                  : `You have access to premium features and ${maxRuns} AI traces/day.`}
              </p>
              <Link href="/pricing">
                <Button variant={user.plan === 'free' ? 'primary' : 'outline'} className="w-full">
                  {user.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Patterns Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Saved Patterns</span>
                  <span className="font-mono font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Traces</span>
                  <span className="font-mono font-medium">{recentVisualizations.length}</span>
                </div>
                <Link href="/patterns" className="text-sm text-[var(--color-accent)] hover:underline mt-2">
                  Browse Pattern Library &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold tracking-tight mb-4">Recent Visualizations</h2>
        
        {recentVisualizations.length === 0 ? (
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No recent traces</h3>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
              You haven't traced any code yet. Head over to the visualizer to trace your first algorithm.
            </p>
            <Link href="/app">
              <Button>Start Tracing</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Language</th>
                    <th className="px-6 py-4 font-medium">Snippet Preview</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisualizations.map((vis) => (
                    <tr key={vis.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-base)] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="capitalize">{vis.language}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[var(--color-text-muted)] truncate max-w-xs">
                        {vis.code.split('\n')[0].substring(0, 50)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-secondary)]">
                        {new Date(vis.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="sm">View Trace</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

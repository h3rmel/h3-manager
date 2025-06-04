import { SelectProject } from '@/components/select-project';
import { ThemeToggle } from '@/components/theme-toggle';

import { cn } from '@/lib/utils';
import { getProjects } from '@/lib/vercel';

export default async function Home() {
  const projects = await getProjects();
  return (
    <main className={cn('w-full min-h-dvh', 'flex justify-center')}>
      <div className={cn('absolute top-4 right-4')}>
        <ThemeToggle />
      </div>
      <section className={cn('max-w-6xl w-full px-4 py-16')}>
        <SelectProject projects={projects} />
      </section>
    </main>
  );
}

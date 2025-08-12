import Dashboard from '@/components/dashboard/Dashboard';
import { salesData } from '@/lib/data';

export default function Home() {
  return (
    <main>
      <Dashboard data={salesData} />
    </main>
  );
}

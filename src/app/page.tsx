import Dashboard from '@/components/dashboard/Dashboard';
import { getSalesData } from '@/lib/data';

export default async function Home() {
  const salesData = await getSalesData();
  return (
    <main>
      <Dashboard data={salesData} />
    </main>
  );
}
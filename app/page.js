import Dashboard from "./components/Dashboard";
import AdminLayout from "./layouts/AdminLayout";


export default function Home() {
  return (
    <AdminLayout>
     <Dashboard/>
    </AdminLayout>
  );
}
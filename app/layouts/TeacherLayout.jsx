import TeacherSidebar from "../components/TeacherSidebar";
import Navbar from "../components/Navbar";

export default function TeacherLayout({ children }) {
  return (
    <div className="h-screen flex bg-[#FAF7F5]">
      <TeacherSidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

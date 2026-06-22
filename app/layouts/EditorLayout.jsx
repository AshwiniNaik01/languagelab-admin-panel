import EditorSidebar from "../components/EditorSidebar";
import Navbar from "../components/Navbar";

export default function EditorLayout({ children }) {
  return (
    <div className="h-screen flex bg-[#FFF8F4]">
      <EditorSidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

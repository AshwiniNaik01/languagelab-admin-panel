import { Suspense } from "react";
import EditorSidebar from "../components/EditorSidebar";
import EditorNavbar from "../components/EditorNavbar";
import ErrorBoundary from "../components/ErrorBoundary";

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-75">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-orange-500" />
    </div>
  );
}

export default function EditorLayout({ children }) {
  return (
    <div className="h-screen flex bg-[#FFF8F4]">
      <EditorSidebar />
      <div className="flex flex-col flex-1">
        <EditorNavbar />
        <main className="flex-1 overflow-y-auto p-8">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

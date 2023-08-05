import Toolbar from "@/components/toolbar";
import Main from "@/components/main";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <div className="no-scrollbar flex w-full flex-shrink-0 flex-wrap items-center gap-1.5 overflow-visible p-1.5 pb-0 print:hidden">
        <Toolbar />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <Main />
      </div>
    </div>
  );
}

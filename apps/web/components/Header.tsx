import { ChevronRight, FileText, UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <FileText className="h-6 w-6" />
          <span className="sr-only">Invoice App</span>
        </a>
        <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Documents
        </a>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <a href="#" className="text-foreground transition-colors hover:text-foreground">
          abcd efgh ijkl.pdf
        </a>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
        </div>
        <div className="flex items-center gap-2">
            <div className="text-right">
                <p className="font-semibold">Alice Doe</p>
                <p className="text-xs text-muted-foreground">Dept/Admin</p>
            </div>
            <UserCircle className="h-8 w-8" />
        </div>
      </div>
    </header>
  );
}
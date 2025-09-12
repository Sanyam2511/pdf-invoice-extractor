import { ChevronRight, MoreVertical, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 flex-shrink-0">
      <nav className="hidden items-center gap-5 text-lg font-medium md:flex md:flex-row md:text-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <span className="sr-only">Toggle Panel</span>
          <PanelLeft className="h-5 w-5 text-slate-500" />
        </Button>
        <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
          Documents
        </a>
        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <a href="#" className="font-semibold text-foreground truncate" title="447PO-Newtek Electricals.pdf">
          447PO-Newtek Electricals.pdf
        </a>
      </div>
    </nav>
      <div className="flex w-full items-center gap-5 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
        </div>
        <div className="flex items-center gap-1.5">
          <Avatar className="h-10 w-10">
              <AvatarImage src="/amit.png" alt="amit" />
              <AvatarFallback>Amit Jadhav</AvatarFallback>
        </Avatar>
            <div className="text-left">
                <p className="font-semibold">Amit Jadhav</p>
                <p className="text-xs text-muted-foreground">DeptAdmin</p>
            </div>
          <Button variant="ghost" size="icon">
              <span className="sr-only">More options</span>
              <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
import {
  LayoutGrid,
  File,
  Share2,
  ArrowUpRightSquare,
  Badge,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  return (
    <aside className="flex h-screen w-16 flex-col items-center border-r bg-white py-4">
      <Avatar className="h-10 w-10">
            <AvatarImage src="/ldl.png" alt="ldl icon" />
            <AvatarFallback>ldl</AvatarFallback>
        </Avatar>

      <nav className="flex flex-col items-center gap-4 mt-8">
        <Link href="#" className="relative flex justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <LayoutGrid className="h-6 w-6" />
          <Badge className="absolute -top-2 -right-2 h-4 w-4 justify-center p-0 text-xs">4</Badge>
        </Link>
        <Link href="#" className="flex justify-center rounded-lg bg-gray-100 p-2 text-blue-600">
          <File className="h-6 w-6" />
        </Link>
        <Link href="#" className="flex justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Share2 className="h-6 w-6" />
        </Link>
      </nav>

      <div className="mt-auto flex flex-col items-center gap-4">
        <Avatar className="h-10 w-10">
            <AvatarImage src="/logo.png" alt="logo" />
            <AvatarFallback>Logo</AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-500">v 1.0.4</span>
      </div>
    </aside>
  );
}
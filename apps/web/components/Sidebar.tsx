import { File, LayoutDashboard, Settings2} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';

export function Sidebar() {
  return (
    <aside className="flex h-screen w-14 flex-col items-center border-r bg-white py-4">
  <div className="relative">
    <div className="h-8 w-8 overflow-hidden rounded-md">
      <Image 
        src="/ldl.png" 
        alt="ldl" 
        layout="fill" 
        objectFit="contain" 
      />
    </div>
    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
  </div>

  <nav className="flex flex-col items-center gap-4 mt-8">
    <Link href="#" className="relative flex justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100">
      <LayoutDashboard className="h-6 w-6" />
    </Link>
    <Link href="#" className="flex justify-center rounded-lg text-gray-500 hover:bg-gray-100">
      <File className="h-6 w-6" />
    </Link>
    <Link href="#" className="flex justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100">
      <Settings2 className="h-6 w-6" />
    </Link>
  </nav>

  <div className="mt-auto flex flex-col items-center gap-4">
    <div className="relative h-8 w-8 overflow-hidden rounded-md">
      <Image 
        src="/logo.png" 
        alt="logo" 
        layout="fill" 
        objectFit="contain" 
      />
    </div>
    <span className="text-xs text-gray-500">v 1.0.4</span>
  </div>
</aside>
  );
}
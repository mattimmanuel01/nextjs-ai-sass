import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";

const Navbar = ({ apiLimitCount }: { apiLimitCount: number }) => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/"></UserButton>
      </div>
    </div>
  );
};

export default Navbar;

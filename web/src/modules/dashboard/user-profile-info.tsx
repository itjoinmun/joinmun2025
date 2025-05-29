"use client";
import { useSession } from "@/utils/hooks/use-session";
import { User } from "lucide-react";

const UserProfileInfo = () => {
  const session = useSession();

  return (
    <div className="flex w-fit items-center gap-2">
      <User />
      <p className="hidden md:block">{session.user?.name}</p>
    </div>
  );
};

export default UserProfileInfo;

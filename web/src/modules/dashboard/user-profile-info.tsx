"use client";
import { useSession } from "@/utils/hooks/use-session";
import { User } from "lucide-react";

const UserProfileInfo = () => {
  const session = useSession();

  return (
    <div className="flex w-fit items-center gap-2">
      <p className="hidden md:block">{session.user?.name}</p>
      <User />
    </div>
  );
};

export default UserProfileInfo;

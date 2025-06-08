"use client";
import { useSession } from "@/utils/hooks/use-session";
import { User } from "lucide-react";

const UserProfileInfo = () => {
  const session = useSession();

  return (
    <div className="flex w-fit max-w-80 items-center gap-2">
      <p className="hidden truncate md:block">{session.user?.name}</p>
      <User />
    </div>
  );
};

export default UserProfileInfo;

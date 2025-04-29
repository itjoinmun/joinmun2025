import { User } from "lucide-react";

const UserProfileInfo = () => {
  return (
    <div className="flex w-fit items-center gap-2">
      <User />
      <p className="hidden md:block">Nia Bunga R</p>
    </div>
  );
};

export default UserProfileInfo;

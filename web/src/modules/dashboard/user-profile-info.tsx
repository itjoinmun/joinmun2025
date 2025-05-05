import { User } from "lucide-react";

const UserProfileInfo = () => {
  return (
    <div className="flex w-fit items-center gap-2">
      <User />
      <p className="hidden md:block">(nama user)</p>
    </div>
  );
};

export default UserProfileInfo;

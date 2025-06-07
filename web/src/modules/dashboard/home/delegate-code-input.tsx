"use client";

import { Input } from "@/components/ui/input";
import joinTeamWithCode from "@/utils/actions/join-team-with-code";
import { cn } from "@/utils/helpers/cn";
import { Users } from "lucide-react";
import { useActionState } from "react";

const initialState = {
  message: "",
  errors: {},
};

const DelegateCodeInput = () => {
  const [state, formAction, pending] = useActionState(joinTeamWithCode, initialState);

  return (
    <div className="flex flex-col gap-2">
      <form action={formAction} className="space-y-1">
        <div className="relative">
          <Input
            name="code"
            disabled={pending}
            placeholder="Enter delegate code"
            className={cn(state?.errors.code && "border-red-normal border-2")}
          />
          <Users className="text-primary absolute top-1/2 right-3 size-5 -translate-y-1/2 bg-transparent" />
        </div>

        {state?.errors && <p className="text-red-normal mt-1.5 text-xs">{state.errors.code}</p>}
      </form>
    </div>
  );
};

export default DelegateCodeInput;

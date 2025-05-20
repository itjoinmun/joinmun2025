import ConfirmationPage from "@/modules/argy/confirmation";
import { DelegateOptions } from "@/utils/helpers/delegates";

const ConfirmationPageRoute = async ({
  params,
  searchParams,
}: {
  params: Promise<{ delegate: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // Get current delegate slug
  const { delegate } = await params;
  
  // Check if we're in team mode
  const isTeam = delegate === "team";

    const index: number = parseInt((await searchParams).idx as string) || 0;


  return (
    <>
      <ConfirmationPage 
        slug={delegate as DelegateOptions} 
        index={index}
        isTeam={isTeam}
      />
    </>
  );
};

export default ConfirmationPageRoute;
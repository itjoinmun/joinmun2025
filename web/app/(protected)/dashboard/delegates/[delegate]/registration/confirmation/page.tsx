import ConfirmationPage from "@/components/argy/confirmation";
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
  const isTeam = searchParams.team === "true";
  
  // Get index from query params (for single delegate registration)
  const indexParam = searchParams.idx;
  const index = indexParam ? parseInt(indexParam as string, 10) : 0;

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
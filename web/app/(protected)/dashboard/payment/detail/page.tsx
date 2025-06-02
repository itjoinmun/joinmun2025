// detail/page.tsx
import PaymentDetailsOriginal from "@/modules/dashboard/payment/payment-details";

const PaymentDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ delegate: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Get current delegate slug
  const { delegate } = await params;
  // Get current index (for Delegate Team only)
  const index: number = parseInt((await searchParams).idx as string) || 0;

  // Dummy props untuk komponen original
  const handleBack = () => {
    console.log("Back clicked");
  };

  const handleSubmit = (file: File) => {
    console.log("Submit clicked with file:", file);
  };

  return (
    <>
      <PaymentDetailsOriginal 
        selectedPrice="1,000,000"
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PaymentDetailPage;
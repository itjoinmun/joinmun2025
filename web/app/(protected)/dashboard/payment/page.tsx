import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/components/dashboard/dashboard-page";
import Payment from "@/modules/dashboard/payment/payment";
import { FormStatusProvider } from "@/utils/hooks/use-form-status";

const PackageSelectionPage = () => {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageTitle>Payment</DashboardPageTitle>
      </DashboardPageHeader>

      <FormStatusProvider>
        <Payment />
      </FormStatusProvider>
    </DashboardPage>
  );
};

export default PackageSelectionPage;

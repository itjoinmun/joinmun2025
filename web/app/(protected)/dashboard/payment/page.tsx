"use server";
import { redirect } from "next/navigation";

const PaymentPage = () => {
  redirect("payment/select");
};

export default PaymentPage;

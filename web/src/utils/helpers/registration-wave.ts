import { toZonedTime } from "date-fns-tz";

export const getCurrentPaymentPhase = () => {
  const timeZone = "Asia/Jakarta";
  const now = new Date();
  const currentDate = toZonedTime(now, timeZone);

  const earlyBirdStart = toZonedTime(new Date("2025-05-16T00:00:00Z"), timeZone);
  const earlyBirdEnd = toZonedTime(new Date("2025-06-14T23:59:59Z"), timeZone);

  const regularStart = toZonedTime(new Date("2025-06-15T00:00:00Z"), timeZone);
  const regularEnd = toZonedTime(new Date("2025-07-14T23:59:59Z"), timeZone);

  if (currentDate >= earlyBirdStart && currentDate <= earlyBirdEnd) {
    return "Early Bird";
  } else if (currentDate >= regularStart && currentDate <= regularEnd) {
    return "Regular";
  } else {
    return "Late";
  }
};

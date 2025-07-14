import { toZonedTime } from "date-fns-tz";

export const getCurrentPaymentPhase = (delegateTime?: string) => {
  const timeZone = "Asia/Jakarta";
  const now = new Date();
  const currentDate = toZonedTime(now, timeZone);

  const earlyBirdStart = toZonedTime(new Date("2025-05-16T00:00:00Z"), timeZone); // Timeline Testing
  // const earlyBirdStart = toZonedTime(new Date("2025-06-16T00:00:00Z"), timeZone); // Timeline Asli
  const earlyBirdEnd = toZonedTime(new Date("2025-07-14T00:30:00Z"), timeZone);

  const regularStart = toZonedTime(new Date("2025-07-28T00:00:00Z"), timeZone);
  const regularEnd = toZonedTime(new Date("2025-08-24T23:59:59Z"), timeZone);

  const lateStart = toZonedTime(new Date("2025-09-08T00:00:00Z"), timeZone);
  const lateEnd = toZonedTime(new Date("2025-09-29T23:59:59Z"), timeZone);

  const delegateDate = delegateTime ? toZonedTime(new Date(delegateTime), timeZone) : null;
  if(delegateTime){
    console.log("Current Date:", currentDate);
    console.log("Delegate Date:", delegateDate);
    console.log("delegateTime:", delegateTime);
    console.log("Early Bird End:", earlyBirdEnd);
  }


  if ((delegateDate && delegateDate <= earlyBirdEnd) || (currentDate >= earlyBirdStart && currentDate <= earlyBirdEnd)) {
    console.log("Early Bird Phase");
    return "Early Bird";
  } else if (currentDate >= earlyBirdEnd && currentDate <= regularStart) {
    console.log("Closed After Early Bird Phase");
    return "Closed After Early Bird";
  } else if ((delegateDate && delegateDate <= regularEnd) || (currentDate >= regularStart && currentDate <= regularEnd)) {
    console.log("Regular Phase");
    return "Regular";
  } else if ((delegateDate && delegateDate <= lateEnd) || (currentDate >= lateStart && currentDate <= lateEnd)) {
    return "Late";
  } else {
    return "Closed";
  }
};

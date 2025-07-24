export const getCurrentPaymentPhase = (delegateTime?: string) => {
  const now = new Date(); // UTC sekarang

  // WIB = UTC+7, jadi WIB 00:00:00 = UTC 17:00:00 (hari sebelumnya)
  const earlyBirdStart = new Date(Date.UTC(2025, 4, 15, 17, 0, 0)); // 2025-05-16 00:00:00 WIB
  const earlyBirdEnd = new Date(Date.UTC(2025, 6, 15, 14, 50, 0)); // 2025-07-14 23:59:59 WIB

  const regularStart = new Date(Date.UTC(2025, 6, 27, 17, 0, 0)); // 2025-07-28 00:00:00 WIB
  const regularEnd = new Date(Date.UTC(2025, 7, 24, 16, 59, 59)); // 2025-08-24 23:59:59 WIB

  const lateStart = new Date(Date.UTC(2025, 8, 7, 17, 0, 0)); // 2025-09-08 00:00:00 WIB
  const lateEnd = new Date(Date.UTC(2025, 8, 29, 16, 59, 59)); // 2025-09-29 23:59:59 WIB

  const delegateDate = delegateTime ? new Date(delegateTime) : null;

  if (
    (delegateDate && delegateDate <= earlyBirdEnd) ||
    (now >= earlyBirdStart && now <= earlyBirdEnd)
  ) {
    return "Early Bird";
  } else if (
    (delegateDate && delegateDate <= regularEnd) ||
    (now >= regularStart && now <= regularEnd)
  ) {
    return "Regular";
  } else if ((delegateDate && delegateDate <= lateEnd) || (now >= lateStart && now <= lateEnd)) {
    return "Late";
  } else {
    return "Closed";
  }
};


// utils/dateHelpers.ts
export const getDateRange = (rangeType: string, customStart?: string, customEndDate?: string) => {
  if (rangeType === 'custom' && customStart && customEndDate) {
    return { startDate: customStart, endDate: customEndDate };
  }

  const end = new Date();
  const start = new Date();
  
  switch (rangeType) {
    case 'last_30_days':
      start.setDate(end.getDate() - 30);
      break;
    case 'last_month':
      start.setMonth(end.getMonth() - 1);
      start.setDate(1);
      end.setDate(0); 
      break;
    case 'this_year':
      start.setMonth(0, 1); 
      break;
    case 'all_time':
    default:
      return { startDate: undefined, endDate: undefined };
  }
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

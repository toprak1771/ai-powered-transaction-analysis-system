const convertExcelDateToJSDate = (excelDate: number): string => {
    // Excel'de 1 Ocak 1900'den itibaren geçen gün sayısını alır
    const baseDate = new Date(1900, 0, 1); // 1 Ocak 1900
    // Excel tarihi 1 gün fazla saydığı için 1 çıkartılır
    const jsDate = new Date(baseDate.getTime() + (excelDate - 2) * 24 * 60 * 60 * 1000);
    return jsDate.toISOString().split('T')[0]; // YYYY-MM-DD formatında döndür
  };

  export {convertExcelDateToJSDate};
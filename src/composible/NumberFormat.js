export function useParsenumber(input) {
  const nums = input.replace(/(,|\$|\s)/g, "").trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums)) {
    return Number(nums)
  };
  return nums === "" ? null : Number.NaN;
}

export function useFormatnumber(value) {
  if (value === null) return "";
  const formattedNumber = value.toFixed(2);
  const [integerPart, decimalPart] = formattedNumber.split(".");
  const integerWithSpaces = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedString = decimalPart ? `${integerWithSpaces}.${decimalPart}` : integerWithSpaces;
  return formattedString;
}

export function usePhoneFormat(phoneNumber) {
  if (phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^998(\d{2})(\d{3})(\d{4})$/);

    if (match) {
      return `+998 ${match[1]}  ${match[2]}  ${match[3].slice(0, 2)} ${match[3].slice(2, 4)}`;
    }
    return phoneNumber;
  }
  return ""
}

export function useSummaFormat(summa, lang = 'ru-RU', room = 2) {
  return new Intl.NumberFormat(lang, {
    style: 'decimal',
    minimumFractionDigits: room
  }).format(summa)
}

export function useStateNumber(plate) {
  if (plate) {
    // Raqam formati: 01 123AA yoki 01 12345AA
    const formattedPlate = plate.replace(/^(\d{2})([A-Z])(\d{3})([A-Z]{2})$/, '$1 $2 $3 $4');
    return formattedPlate;
  }
  return ""
}

export function useDistanceFormat(distance) {
  if (distance) {
    return distance.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' km';
  }
  return "0 km"
}
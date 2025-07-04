import { useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { countries } from "../../../global/dataMock";

interface PhoneInputProps {
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end";
  value?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  className?: string;
  isEditing?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder = "+1 (555) 000-0000",
  onChange,
  selectPosition = "start",
  value,
  disabled = false,
  success = false,
  error = false,
  className,
  isEditing,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === "US") || countries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCountrySelect = (country: (typeof countries)[number]) => {
    setSelectedCountry(country);
    // const formattedNumber = formatPhoneNumber(phoneNumber);
    // setPhoneNumber(formattedNumber);
    setShowDropdown(false);
    //console.log('phoneNumber', phoneNumber);

    handleCountryChange(phoneNumber, country.label);
    // onChange?.(country.label);
  };

  let inputClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  const formatPhoneNumber = useCallback((value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    if (onlyNumbers.length <= 3) return onlyNumbers;
    if (onlyNumbers.length <= 6)
      return `(${onlyNumbers.slice(0, 3)}) ${onlyNumbers.slice(3)}`;
    return `(${onlyNumbers.slice(0, 3)}) ${onlyNumbers.slice(
      3,
      6
    )}-${onlyNumbers.slice(6, 10)}`;
  }, []);

  const filteredCountries = countries.filter(
    (country) =>
      country.code.toLowerCase().includes(search.toLowerCase()) ||
      country.label.toLowerCase().startsWith(search.toLowerCase())
  );

  const handleCountryChange = useCallback(
    (value: string, code: string) => {
      const formattedNumber = formatPhoneNumber(value);
      setPhoneNumber(formattedNumber);
      onChange?.(`${code} ${formattedNumber}`);
    },
    [formatPhoneNumber, onChange]
  );

  const handlePhoneChange = useCallback(
    (input: string) => {
      setEditing(true);
      //console.log('input', input);

      const formatted = formatPhoneNumber(input);
      //console.log('formatted', formatted);
      const dataOnchange = `${selectedCountry.label} ${formatted}`;
      //console.log('dataOnchange', dataOnchange);

      setPhoneNumber(formatted);
      onChange?.(dataOnchange);
    },
    [onChange, selectedCountry, formatPhoneNumber]
  );

  useEffect(() => {
    if (isEditing && !editing) {
      if (!value) return;

      //console.log('dddd', value);
      const matchedCountry =
        countries.find((c) => value.startsWith(c.label)) || countries[0];
      const rawNumber = value.replace(matchedCountry.label, "").trim();

      setSelectedCountry(matchedCountry);
      setPhoneNumber(formatPhoneNumber(rawNumber));
    } else {
      //console.log('new');
    }
  }, [editing, formatPhoneNumber, isEditing, value]);

  //console.log('value', value);
  //console.log('phoneNumber', phoneNumber);

  return (
    <div className="relative flex items-center border p-2 rounded-md">
      {selectPosition === "start" && (
        <div className="relative mr-2">
          <button
            className="inline-flex items-center gap-2 p-2 border rounded-md min-w-max"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <ReactCountryFlag countryCode={selectedCountry.code} svg />
            {selectedCountry.label}
          </button>

          {showDropdown && (
            <div className="absolute top-10 left-0 shadow-md border bg-white dark:bg-gray-900 rounded-md max-h-60 overflow-y-auto z-10">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 w-24 border-b border-gray-300 outline-none text-black dark:bg-gray-900 dark:text-white rounded-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ul>
                {filteredCountries.map((country) => (
                  <li
                    key={country.code}
                    className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <ReactCountryFlag countryCode={country.code} svg />
                    {country.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <input
        type="tel"
        placeholder={placeholder}
        className={inputClasses}
        value={phoneNumber}
        onChange={(e) => handlePhoneChange(e.target.value)}
      />
    </div>
  );
};

export default PhoneInput;

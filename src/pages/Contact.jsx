import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faUser,
  faBuilding,
  faGlobe,
  faBriefcase,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useAdmin } from "../contexts/AdminContext";
import {
  detectSecurityThreat,
  getSecurityErrorMessage,
} from "../utils/securityUtils";

// Country data with flags and codes
const countries = [
  { value: "US", label: "🇺🇸 United States", code: "+1" },
  { value: "CA", label: "🇨🇦 Canada", code: "+1" },
  { value: "GB", label: "🇬🇧 United Kingdom", code: "+44" },
  { value: "DE", label: "🇩🇪 Germany", code: "+49" },
  { value: "FR", label: "🇫🇷 France", code: "+33" },
  { value: "IT", label: "🇮🇹 Italy", code: "+39" },
  { value: "ES", label: "🇪🇸 Spain", code: "+34" },
  { value: "AU", label: "🇦🇺 Australia", code: "+61" },
  { value: "JP", label: "🇯🇵 Japan", code: "+81" },
  { value: "CN", label: "🇨🇳 China", code: "+86" },
  { value: "IN", label: "🇮🇳 India", code: "+91" },
  { value: "BR", label: "🇧🇷 Brazil", code: "+55" },
  { value: "MX", label: "🇲🇽 Mexico", code: "+52" },
  { value: "RU", label: "🇷🇺 Russia", code: "+7" },
  { value: "ZA", label: "🇿🇦 South Africa", code: "+27" },
  { value: "KR", label: "🇰🇷 South Korea", code: "+82" },
  { value: "NL", label: "🇳🇱 Netherlands", code: "+31" },
  { value: "SE", label: "🇸🇪 Sweden", code: "+46" },
  { value: "NO", label: "🇳🇴 Norway", code: "+47" },
  { value: "DK", label: "🇩🇰 Denmark", code: "+45" },
  { value: "FI", label: "🇫🇮 Finland", code: "+358" },
  { value: "PL", label: "🇵🇱 Poland", code: "+48" },
  { value: "TR", label: "🇹🇷 Turkey", code: "+90" },
  { value: "AR", label: "🇦🇷 Argentina", code: "+54" },
  { value: "CL", label: "🇨🇱 Chile", code: "+56" },
  { value: "CO", label: "🇨🇴 Colombia", code: "+57" },
  { value: "PE", label: "🇵🇪 Peru", code: "+51" },
  { value: "VE", label: "🇻🇪 Venezuela", code: "+58" },
  { value: "EG", label: "🇪🇬 Egypt", code: "+20" },
  { value: "NG", label: "🇳🇬 Nigeria", code: "+234" },
  { value: "KE", label: "🇰🇪 Kenya", code: "+254" },
  { value: "MA", label: "🇲🇦 Morocco", code: "+212" },
  { value: "TN", label: "🇹🇳 Tunisia", code: "+216" },
  { value: "AE", label: "🇦🇪 UAE", code: "+971" },
  { value: "SA", label: "🇸🇦 Saudi Arabia", code: "+966" },
  { value: "IL", label: "🇮🇱 Israel", code: "+972" },
  { value: "TH", label: "🇹🇭 Thailand", code: "+66" },
  { value: "MY", label: "🇲🇾 Malaysia", code: "+60" },
  { value: "SG", label: "🇸🇬 Singapore", code: "+65" },
  { value: "PH", label: "🇵🇭 Philippines", code: "+63" },
  { value: "ID", label: "🇮🇩 Indonesia", code: "+62" },
  { value: "VN", label: "🇻🇳 Vietnam", code: "+84" },
  { value: "PK", label: "🇵🇰 Pakistan", code: "+92" },
  { value: "BD", label: "🇧🇩 Bangladesh", code: "+880" },
  { value: "LK", label: "🇱🇰 Sri Lanka", code: "+94" },
  { value: "NP", label: "🇳🇵 Nepal", code: "+977" },
  { value: "MM", label: "🇲🇲 Myanmar", code: "+95" },
  { value: "KH", label: "🇰🇭 Cambodia", code: "+855" },
  { value: "LA", label: "🇱🇦 Laos", code: "+856" },
  { value: "NZ", label: "🇳🇿 New Zealand", code: "+64" },
  { value: "PT", label: "🇵🇹 Portugal", code: "+351" },
  { value: "CH", label: "🇨🇭 Switzerland", code: "+41" },
  { value: "AT", label: "🇦🇹 Austria", code: "+43" },
  { value: "BE", label: "🇧🇪 Belgium", code: "+32" },
  { value: "CZ", label: "🇨🇿 Czech Republic", code: "+420" },
  { value: "GR", label: "🇬🇷 Greece", code: "+30" },
  { value: "HU", label: "🇭🇺 Hungary", code: "+36" },
  { value: "IE", label: "🇮🇪 Ireland", code: "+353" },
  { value: "LU", label: "🇱🇺 Luxembourg", code: "+352" },
  { value: "MT", label: "🇲🇹 Malta", code: "+356" },
  { value: "SK", label: "🇸🇰 Slovakia", code: "+421" },
  { value: "SI", label: "🇸🇮 Slovenia", code: "+386" },
  { value: "EE", label: "🇪🇪 Estonia", code: "+372" },
  { value: "LV", label: "🇱🇻 Latvia", code: "+371" },
  { value: "LT", label: "🇱🇹 Lithuania", code: "+370" },
  { value: "HR", label: "🇭🇷 Croatia", code: "+385" },
  { value: "BA", label: "🇧🇦 Bosnia and Herzegovina", code: "+387" },
  { value: "ME", label: "🇲🇪 Montenegro", code: "+382" },
  { value: "MK", label: "🇲🇰 North Macedonia", code: "+389" },
  { value: "AL", label: "🇦🇱 Albania", code: "+355" },
  { value: "RS", label: "🇷🇸 Serbia", code: "+381" },
  { value: "BG", label: "🇧🇬 Bulgaria", code: "+359" },
  { value: "RO", label: "🇷🇴 Romania", code: "+40" },
  { value: "MD", label: "🇲🇩 Moldova", code: "+373" },
  { value: "UA", label: "🇺🇦 Ukraine", code: "+380" },
  { value: "BY", label: "🇧🇾 Belarus", code: "+375" },
  { value: "GE", label: "🇬🇪 Georgia", code: "+995" },
  { value: "AM", label: "🇦🇲 Armenia", code: "+374" },
  { value: "AZ", label: "🇦🇿 Azerbaijan", code: "+994" },
  { value: "KZ", label: "🇰🇿 Kazakhstan", code: "+7" },
  { value: "UZ", label: "🇺🇿 Uzbekistan", code: "+998" },
  { value: "TM", label: "🇹🇲 Turkmenistan", code: "+993" },
  { value: "TJ", label: "🇹🇯 Tajikistan", code: "+992" },
  { value: "KG", label: "🇰🇬 Kyrgyzstan", code: "+996" },
  { value: "MN", label: "🇲🇳 Mongolia", code: "+976" },
  { value: "TW", label: "🇹🇼 Taiwan", code: "+886" },
  { value: "HK", label: "🇭🇰 Hong Kong", code: "+852" },
  { value: "MO", label: "🇲🇴 Macau", code: "+853" },
  { value: "BN", label: "🇧🇳 Brunei", code: "+673" },
  { value: "FJ", label: "🇫🇯 Fiji", code: "+679" },
  { value: "PG", label: "🇵🇬 Papua New Guinea", code: "+675" },
  { value: "SB", label: "🇸🇧 Solomon Islands", code: "+677" },
  { value: "VU", label: "🇻🇺 Vanuatu", code: "+678" },
  { value: "WS", label: "🇼🇸 Samoa", code: "+685" },
  { value: "TO", label: "🇹🇴 Tonga", code: "+676" },
  { value: "TV", label: "🇹🇻 Tuvalu", code: "+688" },
  { value: "KI", label: "🇰🇮 Kiribati", code: "+686" },
  { value: "MH", label: "🇲🇭 Marshall Islands", code: "+692" },
  { value: "PW", label: "🇵🇼 Palau", code: "+680" },
  { value: "FM", label: "🇫🇲 Micronesia", code: "+691" },
  { value: "NR", label: "🇳🇷 Nauru", code: "+674" },
  { value: "CK", label: "🇨🇰 Cook Islands", code: "+682" },
  { value: "NU", label: "🇳🇺 Niue", code: "+683" },
  { value: "AS", label: "🇦🇸 American Samoa", code: "+1" },
  { value: "GU", label: "🇬🇺 Guam", code: "+1" },
  { value: "MP", label: "🇲🇵 Northern Mariana Islands", code: "+1" },
  { value: "PR", label: "🇵🇷 Puerto Rico", code: "+1" },
  { value: "VI", label: "🇻🇮 U.S. Virgin Islands", code: "+1" },
  { value: "UM", label: "🇺🇲 U.S. Minor Outlying Islands", code: "+1" },
  { value: "BM", label: "🇧🇲 Bermuda", code: "+1" },
  { value: "GL", label: "🇬🇱 Greenland", code: "+299" },
  { value: "IS", label: "🇮🇸 Iceland", code: "+354" },
  { value: "FO", label: "🇫🇴 Faroe Islands", code: "+298" },
  { value: "GG", label: "🇬🇬 Guernsey", code: "+44" },
  { value: "JE", label: "🇯🇪 Jersey", code: "+44" },
  { value: "IM", label: "🇮🇲 Isle of Man", code: "+44" },
  { value: "GI", label: "🇬🇮 Gibraltar", code: "+350" },
  { value: "PT", label: "🇵🇹 Portugal", code: "+351" },
  { value: "ES", label: "🇪🇸 Spain", code: "+34" },
  { value: "AD", label: "🇦🇩 Andorra", code: "+376" },
  { value: "MC", label: "🇲🇨 Monaco", code: "+377" },
  { value: "SM", label: "🇸🇲 San Marino", code: "+378" },
  { value: "VA", label: "🇻🇦 Vatican City", code: "+379" },
  { value: "LI", label: "🇱🇮 Liechtenstein", code: "+423" },
  { value: "SJ", label: "🇸🇯 Svalbard and Jan Mayen", code: "+47" },
  { value: "AX", label: "🇦🇽 Åland Islands", code: "+358" },
  { value: "CW", label: "🇨🇼 Curaçao", code: "+599" },
  { value: "BQ", label: "🇧🇶 Caribbean Netherlands", code: "+599" },
  { value: "SX", label: "🇸🇽 Sint Maarten", code: "+1" },
  { value: "AW", label: "🇦🇼 Aruba", code: "+297" },
  { value: "TT", label: "🇹🇹 Trinidad and Tobago", code: "+1" },
  { value: "KN", label: "🇰🇳 Saint Kitts and Nevis", code: "+1" },
  { value: "LC", label: "🇱🇨 Saint Lucia", code: "+1" },
  { value: "VC", label: "🇻🇨 Saint Vincent and the Grenadines", code: "+1" },
  { value: "GD", label: "🇬🇩 Grenada", code: "+1" },
  { value: "DM", label: "🇩🇲 Dominica", code: "+1" },
  { value: "AG", label: "🇦🇬 Antigua and Barbuda", code: "+1" },
  { value: "BB", label: "🇧🇧 Barbados", code: "+1" },
  { value: "BS", label: "🇧🇸 Bahamas", code: "+1" },
  { value: "BZ", label: "🇧🇿 Belize", code: "+501" },
  { value: "CR", label: "🇨🇷 Costa Rica", code: "+506" },
  { value: "SV", label: "🇸🇻 El Salvador", code: "+503" },
  { value: "GT", label: "🇬🇹 Guatemala", code: "+502" },
  { value: "HN", label: "🇭🇳 Honduras", code: "+504" },
  { value: "NI", label: "🇳🇮 Nicaragua", code: "+505" },
  { value: "PA", label: "🇵🇦 Panama", code: "+507" },
  { value: "HT", label: "🇭🇹 Haiti", code: "+509" },
  { value: "DO", label: "🇩🇴 Dominican Republic", code: "+1" },
  { value: "JM", label: "🇯🇲 Jamaica", code: "+1" },
  { value: "CU", label: "🇨🇺 Cuba", code: "+53" },
  { value: "KY", label: "🇰🇾 Cayman Islands", code: "+1" },
  { value: "TC", label: "🇹🇨 Turks and Caicos Islands", code: "+1" },
  { value: "VG", label: "🇻🇬 British Virgin Islands", code: "+1" },
  { value: "VI", label: "🇻🇮 U.S. Virgin Islands", code: "+1" },
  { value: "MS", label: "🇲🇸 Montserrat", code: "+1" },
  { value: "AI", label: "🇦🇮 Anguilla", code: "+1" },
  { value: "BL", label: "🇧🇱 Saint Barthélemy", code: "+590" },
  { value: "MF", label: "🇲🇫 Saint Martin", code: "+590" },
  { value: "GP", label: "🇬🇵 Guadeloupe", code: "+590" },
  { value: "MQ", label: "🇲🇶 Martinique", code: "+596" },
  { value: "GF", label: "🇬🇫 French Guiana", code: "+594" },
  { value: "RE", label: "🇷🇪 Réunion", code: "+262" },
  { value: "YT", label: "🇾🇹 Mayotte", code: "+262" },
  { value: "SC", label: "🇸🇨 Seychelles", code: "+248" },
  { value: "MU", label: "🇲🇺 Mauritius", code: "+230" },
  { value: "KM", label: "🇰🇲 Comoros", code: "+269" },
  { value: "MG", label: "🇲🇬 Madagascar", code: "+261" },
  { value: "ZW", label: "🇿🇼 Zimbabwe", code: "+263" },
  { value: "ZM", label: "🇿🇲 Zambia", code: "+260" },
  { value: "MW", label: "🇲🇼 Malawi", code: "+265" },
  { value: "MZ", label: "🇲🇿 Mozambique", code: "+258" },
  { value: "BW", label: "🇧🇼 Botswana", code: "+267" },
  { value: "SZ", label: "🇸🇿 Eswatini", code: "+268" },
  { value: "LS", label: "🇱🇸 Lesotho", code: "+266" },
  { value: "NA", label: "🇳🇦 Namibia", code: "+264" },
  { value: "GQ", label: "🇬🇶 Equatorial Guinea", code: "+240" },
  { value: "GA", label: "🇬🇦 Gabon", code: "+241" },
  { value: "CG", label: "🇨🇬 Republic of the Congo", code: "+242" },
  { value: "CD", label: "🇨🇩 Democratic Republic of the Congo", code: "+243" },
  { value: "AO", label: "🇦🇴 Angola", code: "+244" },
  { value: "BJ", label: "🇧🇯 Benin", code: "+229" },
  { value: "BF", label: "🇧🇫 Burkina Faso", code: "+226" },
  { value: "CV", label: "🇨🇻 Cape Verde", code: "+238" },
  { value: "GH", label: "🇬🇭 Ghana", code: "+233" },
  { value: "GM", label: "🇬🇲 Gambia", code: "+220" },
  { value: "GN", label: "🇬🇳 Guinea", code: "+224" },
  { value: "GW", label: "🇬🇼 Guinea-Bissau", code: "+245" },
  { value: "LR", label: "🇱🇷 Liberia", code: "+231" },
  { value: "ML", label: "🇲🇱 Mali", code: "+223" },
  { value: "MR", label: "🇲🇷 Mauritania", code: "+222" },
  { value: "NE", label: "🇳🇪 Niger", code: "+227" },
  { value: "SN", label: "🇸🇳 Senegal", code: "+221" },
  { value: "SL", label: "🇸🇱 Sierra Leone", code: "+232" },
  { value: "TG", label: "🇹🇬 Togo", code: "+228" },
  { value: "CI", label: "🇨🇮 Ivory Coast", code: "+225" },
  { value: "CM", label: "🇨🇲 Cameroon", code: "+237" },
  { value: "TD", label: "🇹🇩 Chad", code: "+235" },
  { value: "CF", label: "🇨🇫 Central African Republic", code: "+236" },
  { value: "SS", label: "🇸🇸 South Sudan", code: "+211" },
  { value: "UG", label: "🇺🇬 Uganda", code: "+256" },
  { value: "RW", label: "🇷🇼 Rwanda", code: "+250" },
  { value: "BI", label: "🇧🇮 Burundi", code: "+257" },
  { value: "TZ", label: "🇹🇿 Tanzania", code: "+255" },
  { value: "DJ", label: "🇩🇯 Djibouti", code: "+253" },
  { value: "ER", label: "🇪🇷 Eritrea", code: "+291" },
  { value: "ET", label: "🇪🇹 Ethiopia", code: "+251" },
  { value: "SO", label: "🇸🇴 Somalia", code: "+252" },
  { value: "SD", label: "🇸🇩 Sudan", code: "+249" },
  { value: "LY", label: "🇱🇾 Libya", code: "+218" },
  { value: "TN", label: "🇹🇳 Tunisia", code: "+216" },
  { value: "DZ", label: "🇩🇿 Algeria", code: "+213" },
  { value: "MA", label: "🇲🇦 Morocco", code: "+212" },
  { value: "EH", label: "🇪🇭 Western Sahara", code: "+212" },
  { value: "JO", label: "🇯🇴 Jordan", code: "+962" },
  { value: "LB", label: "🇱🇧 Lebanon", code: "+961" },
  { value: "SY", label: "🇸🇾 Syria", code: "+963" },
  { value: "IQ", label: "🇮🇶 Iraq", code: "+964" },
  { value: "KW", label: "🇰🇼 Kuwait", code: "+965" },
  { value: "BH", label: "🇧🇭 Bahrain", code: "+973" },
  { value: "QA", label: "🇶🇦 Qatar", code: "+974" },
  { value: "OM", label: "🇴🇲 Oman", code: "+968" },
  { value: "YE", label: "🇾🇪 Yemen", code: "+967" },
  { value: "PS", label: "🇵🇸 Palestine", code: "+970" },
  { value: "AF", label: "🇦🇫 Afghanistan", code: "+93" },
  { value: "IR", label: "🇮🇷 Iran", code: "+98" },
  { value: "BT", label: "🇧🇹 Bhutan", code: "+975" },
  { value: "MV", label: "🇲🇻 Maldives", code: "+960" },
  { value: "IO", label: "🇮🇴 British Indian Ocean Territory", code: "+246" },
  { value: "CX", label: "🇨🇽 Christmas Island", code: "+61" },
  { value: "CC", label: "🇨🇨 Cocos (Keeling) Islands", code: "+61" },
  { value: "NF", label: "🇳🇫 Norfolk Island", code: "+672" },
  { value: "HM", label: "🇭🇲 Heard Island and McDonald Islands", code: "+672" },
  {
    value: "GS",
    label: "🇬🇸 South Georgia and the South Sandwich Islands",
    code: "+500",
  },
  { value: "FK", label: "🇫🇰 Falkland Islands", code: "+500" },
  { value: "SH", label: "🇸🇭 Saint Helena", code: "+290" },
  { value: "TA", label: "🇹🇦 Tristan da Cunha", code: "+290" },
  { value: "AC", label: "🇦🇨 Ascension Island", code: "+247" },
  { value: "DG", label: "🇩🇬 Diego Garcia", code: "+246" },
  { value: "PN", label: "🇵🇳 Pitcairn Islands", code: "+64" },
  { value: "TK", label: "🇹🇰 Tokelau", code: "+690" },
  { value: "WF", label: "🇼🇫 Wallis and Futuna", code: "+681" },
  { value: "NC", label: "🇳🇨 New Caledonia", code: "+687" },
  { value: "PF", label: "🇵🇫 French Polynesia", code: "+689" },
  { value: "PM", label: "🇵🇲 Saint Pierre and Miquelon", code: "+508" },
  { value: "BV", label: "🇧🇻 Bouvet Island", code: "+47" },
  { value: "TF", label: "🇹🇫 French Southern Territories", code: "+262" },
  { value: "AQ", label: "🇦🇶 Antarctica", code: "+672" },
];

const Contact = () => {
  const { addInquiry } = useAdmin();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: countries[0], // Default to first country
    phoneNumber: "",
    company: "",
    selectedCountry: null,
    jobTitle: "",
    jobDetails: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasSecurityThreat, setHasSecurityThreat] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check for security threats
    const securityError = getSecurityErrorMessage(value);
    if (securityError) {
      setErrors((prev) => ({
        ...prev,
        [name]: securityError,
      }));
    }

    // Check if any field has security threat
    const updatedFormData = { ...formData, [name]: value };
    const hasThreat = Object.values(updatedFormData).some((val) =>
      detectSecurityThreat(val)
    );
    setHasSecurityThreat(hasThreat);
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check for security threats in selected option
    if (selectedOption && selectedOption.label) {
      const securityError = getSecurityErrorMessage(selectedOption.label);
      if (securityError) {
        setErrors((prev) => ({
          ...prev,
          [name]: securityError,
        }));
      }
    }

    // Check if any field has security threat
    const updatedFormData = { ...formData, [name]: selectedOption };
    const hasThreat = Object.values(updatedFormData).some((val) => {
      if (typeof val === "object" && val.label) {
        return detectSecurityThreat(val.label);
      }
      return detectSecurityThreat(val);
    });
    setHasSecurityThreat(hasThreat);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (detectSecurityThreat(formData.name)) {
      newErrors.name = getSecurityErrorMessage(formData.name);
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    } else if (detectSecurityThreat(formData.email)) {
      newErrors.email = getSecurityErrorMessage(formData.email);
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (detectSecurityThreat(formData.phoneNumber)) {
      newErrors.phoneNumber = getSecurityErrorMessage(formData.phoneNumber);
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (detectSecurityThreat(formData.company)) {
      newErrors.company = getSecurityErrorMessage(formData.company);
    }

    if (!formData.selectedCountry) {
      newErrors.selectedCountry = "Country is required";
    } else if (detectSecurityThreat(formData.selectedCountry.label)) {
      newErrors.selectedCountry = getSecurityErrorMessage(
        formData.selectedCountry.label
      );
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    } else if (detectSecurityThreat(formData.jobTitle)) {
      newErrors.jobTitle = getSecurityErrorMessage(formData.jobTitle);
    }

    if (!formData.jobDetails.trim()) {
      newErrors.jobDetails = "Job details are required";
    } else if (formData.jobDetails.length < 20) {
      newErrors.jobDetails = "Job details must be at least 20 characters long";
    } else if (detectSecurityThreat(formData.jobDetails)) {
      newErrors.jobDetails = getSecurityErrorMessage(formData.jobDetails);
    }

    setErrors(newErrors);
    const hasThreat = Object.keys(newErrors).some(
      (key) => newErrors[key] && newErrors[key].includes("attack detected")
    );
    setHasSecurityThreat(hasThreat);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        phone: formData.countryCode.code + formData.phoneNumber,
        country: formData.selectedCountry ? formData.selectedCountry.label : "",
      };

      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Failed to submit inquiry");

      const savedInquiry = await response.json();
      console.log("✅ Inquiry saved:", savedInquiry);

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        countryCode: countries[0],
        phoneNumber: "",
        company: "",
        selectedCountry: null,
        jobTitle: "",
        jobDetails: "",
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Page Header */}
      <section className="page-header bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
              <p className="lead mb-0">
                Ready to start your project? Let's discuss how we can help
                transform your business
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          {/* Contact Form */}
          <Col lg={8} className="mb-5">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-4">Get In Touch</h3>

                {submitSuccess && (
                  <Alert variant="success" className="mb-4">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Thank you! Your inquiry has been submitted successfully.
                    We'll get back to you within 24 hours.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.name}
                          placeholder="Enter your full name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Email Address *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter your email address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FontAwesomeIcon icon={faPhone} className="me-2" />
                          Phone Number *
                        </Form.Label>
                        <Row>
                          <Col xs={4}>
                            <Select
                              name="countryCode"
                              value={formData.countryCode}
                              onChange={handleSelectChange}
                              options={countries.map((country) => ({
                                value: country.code,
                                label: `${country.label.split(" ")[0]} ${
                                  country.code
                                }`,
                                ...country,
                              }))}
                              placeholder="Code"
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  borderColor: errors.phoneNumber
                                    ? "#dc3545"
                                    : provided.borderColor,
                                  "&:hover": {
                                    borderColor: errors.phoneNumber
                                      ? "#dc3545"
                                      : provided.borderColor,
                                  },
                                  minHeight: "38px",
                                  fontSize: "14px",
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  fontSize: "14px",
                                }),
                              }}
                            />
                          </Col>
                          <Col xs={8}>
                            <Form.Control
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              isInvalid={!!errors.phoneNumber}
                              placeholder="Enter your phone number"
                            />
                          </Col>
                        </Row>
                        <Form.Control.Feedback
                          type="invalid"
                          style={{
                            display: errors.phoneNumber ? "block" : "none",
                          }}
                        >
                          {errors.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FontAwesomeIcon icon={faBuilding} className="me-2" />
                          Company Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          isInvalid={!!errors.company}
                          placeholder="Enter your company name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.company}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FontAwesomeIcon icon={faGlobe} className="me-2" />
                          Country *
                        </Form.Label>
                        <Select
                          name="selectedCountry"
                          value={formData.selectedCountry}
                          onChange={handleSelectChange}
                          options={countries}
                          placeholder="Select your country"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              borderColor: errors.selectedCountry
                                ? "#dc3545"
                                : provided.borderColor,
                              "&:hover": {
                                borderColor: errors.selectedCountry
                                  ? "#dc3545"
                                  : provided.borderColor,
                              },
                              minHeight: "38px",
                              fontSize: "14px",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              fontSize: "14px",
                            }),
                          }}
                        />
                        <div
                          className="invalid-feedback"
                          style={{
                            display: errors.selectedCountry ? "block" : "none",
                          }}
                        >
                          {errors.selectedCountry}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <FontAwesomeIcon
                            icon={faBriefcase}
                            className="me-2"
                          />
                          Job Title *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          isInvalid={!!errors.jobTitle}
                          placeholder="Enter your job title"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.jobTitle}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                      Job Details *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="jobDetails"
                      value={formData.jobDetails}
                      onChange={handleInputChange}
                      isInvalid={!!errors.jobDetails}
                      placeholder="Describe your project requirements, challenges, and goals..."
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.jobDetails}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Please provide as much detail as possible about your
                      project requirements.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting || hasSecurityThreat}
                      className="py-2"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Contact Information</h4>

                <div className="d-flex align-items-start mb-3">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Email</h6>
                    <p className="text-muted mb-0">info@aisolution.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Phone</h6>
                    <p className="text-muted mb-0">+977 981-765-9722</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Address</h6>
                    <p className="text-muted mb-0">
                      749 New Road Street
                      <br />
                      Kathmandu Valley, CA 44600
                      <br />
                      Kathmandu
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Business Hours</h6>
                    <p className="text-muted mb-0">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 2:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Why Choose Us?</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary me-2"
                    />
                    Fast response time (within 24 hours)
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary me-2"
                    />
                    Free initial consultation
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary me-2"
                    />
                    Experienced development team
                  </li>
                  <li className="mb-2">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-primary me-2"
                    />
                    Proven track record
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;

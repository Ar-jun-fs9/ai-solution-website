// Security utility functions for detecting SQL injection and XSS payloads

/**
 * Detects potential SQL injection patterns in input
 * @param {string} input - The input string to check
 * @returns {boolean} - True if SQL injection pattern detected
 */
export const detectSQLInjection = (input) => {
  if (!input || typeof input !== 'string') return false;

  // Common SQL injection patterns
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /(\b(or|and)\s+\d+\s*=\s*\d+\b)/i,
    /('|(\\')|(\\)|(\\;)|(\\\\)|(\-\-)|(\#)|(\%3B)|(\%27)|(\%22))/i,
    /(\bscript\b)/i,
    /(\bdatabase\b|\btable\b|\bcolumn\b)/i,
    /(\b--)|(\#)|(\%23)/i,
    /(\b\/\*|\*\/)/i,
    /(\b1\s*=\s*1\b)/i,
    /(\bnull\b|\btrue\b|\bfalse\b)/i,
    /(\bchar\(|concat\(|substring\()/i
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Detects potential XSS (Cross-Site Scripting) patterns in input
 * @param {string} input - The input string to check
 * @returns {boolean} - True if XSS pattern detected
 */
export const detectXSS = (input) => {
  if (!input || typeof input !== 'string') return false;

  // Common XSS patterns
  const xssPatterns = [
    /(<script|<img|<iframe|<object|<embed|<link|<meta|<form)/i,
    /(javascript:|vbscript:|data:text|data:image)/i,
    /(on\w+\s*=)/i,
    /(style\s*=.*expression|style\s*=.*javascript)/i,
    /(<|>|<|>)/i,
    /(\%3C|\%3E)/i, // URL encoded < >
    /(alert\(|confirm\(|prompt\()/i,
    /(document\.|window\.|location\.)/i,
    /(eval\(|setTimeout\(|setInterval\()/i,
    /(<svg|<xml|<html|<body|<head)/i
  ];

  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Checks if input contains any security threats (SQL injection or XSS)
 * @param {string} input - The input string to check
 * @returns {boolean} - True if any threat detected
 */
export const detectSecurityThreat = (input) => {
  return detectSQLInjection(input) || detectXSS(input);
};

/**
 * Gets appropriate error message for detected threats
 * @param {string} input - The input string to check
 * @returns {string} - Error message or empty string
 */
export const getSecurityErrorMessage = (input) => {
  if (detectSQLInjection(input) && detectXSS(input)) {
    return "Potential SQL injection and XSS attack detected. Please enter valid input.";
  } else if (detectSQLInjection(input)) {
    return "Potential SQL injection attack detected. Please enter valid input.";
  } else if (detectXSS(input)) {
    return "Potential XSS attack detected. Please enter valid input.";
  }
  return "";
};
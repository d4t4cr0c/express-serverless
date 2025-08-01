/**
 * Input validation and sanitization utilities
 */

export class ValidationUtils {
  
  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  /**
   * Sanitize and validate product data
   */
  static sanitizeProductData(data: any): any {
    if (!data || typeof data !== 'object') return null;
    
    const sanitized = {
      category_id: this.sanitizeString(data.category_id, 50),
      'product-category': this.sanitizeString(data['product-category'], 100),
      title: this.sanitizeString(data.title, 500),
      subtitle: this.sanitizeString(data.subtitle, 500),
      author: this.sanitizeString(data.author, 200),
      description: this.sanitizeHtml(data.description),
      'product-code-or-isbn': this.sanitizeString(data['product-code-or-isbn'], 50),
      price: this.sanitizeNumber(data.price),
      base_price: this.sanitizeNumber(data.base_price),
      currency_id: this.sanitizeString(data.currency_id, 10),
      available_quantity: this.sanitizeInteger(data.available_quantity)
    };
    
    return sanitized;
  }
  
  /**
   * Sanitize string input
   */
  static sanitizeString(input: any, maxLength: number = 1000): string {
    if (!input) return '';
    
    const str = String(input);
    return str
      .replace(/[<>'"]/g, '') // Remove dangerous characters
      .trim()
      .substring(0, maxLength);
  }
  
  /**
   * Sanitize and validate number input
   */
  static sanitizeNumber(input: any): number | null {
    if (input === null || input === undefined || input === '') return null;
    
    const num = parseFloat(input);
    if (isNaN(num) || !isFinite(num)) return null;
    
    // Prevent extremely large numbers
    if (num > 999999999 || num < -999999999) return null;
    
    return Math.round(num * 100) / 100; // Round to 2 decimal places
  }
  
  /**
   * Sanitize and validate integer input
   */
  static sanitizeInteger(input: any): number | null {
    if (input === null || input === undefined || input === '') return null;
    
    const num = parseInt(input);
    if (isNaN(num) || !isFinite(num)) return null;
    
    // Prevent extremely large numbers
    if (num > 999999999 || num < 0) return null;
    
    return num;
  }
  
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Check for common SQL injection patterns
   */
  static containsSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/)/,
      /(\bOR\b.*=.*\bOR\b)/i,
      /(\bAND\b.*=.*\bAND\b)/i,
      /([\'\";])/
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
  
  /**
   * Check for XSS patterns
   */
  static containsXss(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<[^>]*\s(on\w+|href|src)\s*=/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
}

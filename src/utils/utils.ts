export function convertBase10ToBase62(num: number): string {
  const chars = '012345689abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  if (num < 0 || num === 0) {
    return '0';
  }
  while (num > 0) {
    const remainder = num % 62;
    result = chars[remainder] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

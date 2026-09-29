export function getCookie(
  cookieHeader: string | undefined,
  name: string,
): string | null {
  if (!cookieHeader) {
    return null;
  }
  console.log('cookieHeader',cookieHeader)

  const cookies = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const separatorIndex =
      cookie.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key =
      cookie.slice(0, separatorIndex);

    const value =
      cookie.slice(separatorIndex + 1);

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}
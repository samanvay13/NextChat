import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return undefined;
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [key, value] = cookie.trim().split('=');
          if (key === name) {
            return decodeURIComponent(value);
          }
        }
        return undefined;
      },
      set(name: string, value: string, options: any) {
        if (typeof document === 'undefined') return;
        let cookieString = `${name}=${encodeURIComponent(value)}`;
        
        if (options?.maxAge) cookieString += `; max-age=${options.maxAge}`;
        if (options?.path) cookieString += `; path=${options.path}`;
        if (options?.domain) cookieString += `; domain=${options.domain}`;
        if (options?.secure) cookieString += `; secure`;
        if (options?.sameSite) cookieString += `; samesite=${options.sameSite}`;
        
        document.cookie = cookieString;
      },
      remove(name: string, options: any) {
        if (typeof document === 'undefined') return;
        let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        if (options?.path) cookieString += `; path=${options.path}`;
        if (options?.domain) cookieString += `; domain=${options.domain}`;
        document.cookie = cookieString;
      },
    },
  }
)
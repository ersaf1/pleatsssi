export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('your-supabase-project') || url.includes('placeholder') || url.includes('example.com')) return false;
  if (key.includes('your-anon-key') || key.includes('placeholder')) return false;
  return true;
}

export function withTimeout<T>(promise: PromiseLike<T>, ms: number = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Supabase query timeout')), ms);
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Find Supabase cookies specifically
    const supabaseCookies = allCookies.filter(cookie => 
      cookie.name.includes('sb-') || 
      cookie.name.includes('supabase')
    );

    // Show all cookie details
    console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value, length: c.value.length })));
    console.log('Supabase cookies:', supabaseCookies.map(c => ({ name: c.name, hasValue: !!c.value, length: c.value.length })));

    return NextResponse.json({
      success: true,
      debug: {
        totalCookies: allCookies.length,
        supabaseCookies: supabaseCookies.map(c => ({ 
          name: c.name, 
          hasValue: !!c.value,
          length: c.value.length,
          preview: c.value.substring(0, 50) + '...' 
        })),
        allCookieNames: allCookies.map(c => c.name)
      }
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
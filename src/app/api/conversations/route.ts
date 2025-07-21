import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabase-server';
import { ChatService } from '../../../lib/chat-service';

export async function GET(request: NextRequest) {
  try {
    console.log('=== CONVERSATIONS API DEBUG ===');
    
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('Auth result:', { 
      user: user?.email || 'None', 
      error: userError?.message || 'None' 
    });

    if (userError || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Please log in again' 
      }, { status: 401 });
    }

    const conversations = await ChatService.getUserConversations(user.id);

    return NextResponse.json({
      success: true,
      conversations
    });

  } catch (error: any) {
    console.error('Conversations API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
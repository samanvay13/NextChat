import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../lib/supabase-server';
import { ChatService } from '../../../../../lib/chat-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== MESSAGES API DEBUG ===');
    
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

    const { id: conversationId } = await params;
    console.log('Getting messages for conversation:', conversationId);

    const messages = await ChatService.getConversationMessages(conversationId, user.id);

    console.log('Found messages:', messages.length);

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error: any) {
    console.error('Messages API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
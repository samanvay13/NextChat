import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '../../../../../lib/chat-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from middleware headers
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Please log in again' 
      }, { status: 401 });
    }

    const conversationId = params.id;
    const messages = await ChatService.getConversationMessages(conversationId, userId);

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
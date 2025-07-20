import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '../../../../../lib/chat-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Please log in again' 
      }, { status: 401 });
    }

    const { id: conversationId } = await params;
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
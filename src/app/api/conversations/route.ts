import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '../../../lib/chat-service';

export async function GET(request: NextRequest) {
  try {
    // Get user from middleware headers
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Please log in again' 
      }, { status: 401 });
    }

    const conversations = await ChatService.getUserConversations(userId);

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
import { NextRequest, NextResponse } from 'next/server';
import openai from '../../../lib/openai';
import { ChatService } from '../../../lib/chat-service';
import { ImageUploadService } from '../../../lib/image-upload';

export async function POST(request: NextRequest) {
  try {
    // Get user from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Please log in again' 
      }, { status: 401 });
    }

    console.log('Authenticated user:', { userId, userEmail });

    const formData = await request.formData();
    const message = formData.get('message') as string;
    const conversationId = formData.get('conversationId') as string;
    const imageFile = formData.get('image') as File;

    if (!message && !imageFile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message or image is required' 
      }, { status: 400 });
    }

    let conversation;
    let imageUrl: string | undefined;

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await ImageUploadService.uploadImage(imageFile, userId);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to upload image' 
        }, { status: 500 });
      }
    }

    // Get or create conversation
    if (conversationId) {
      conversation = await ChatService.getConversation(conversationId, userId);
      if (!conversation) {
        return NextResponse.json({ 
          success: false, 
          error: 'Conversation not found' 
        }, { status: 404 });
      }
    } else {
      // Create new conversation
      const title = await ChatService.generateConversationTitle(message || 'Image Analysis');
      conversation = await ChatService.createConversation(userId, title);
    }

    // Add user message to database
    const userMessage = await ChatService.addMessage(
      conversation.id,
      userId,
      message || 'Please analyze this image',
      'user',
      imageUrl
    );

    // Get conversation history for context
    const messages = await ChatService.getConversationMessages(conversation.id, userId);
    const contextPrompt = ChatService.buildContextPrompt(messages, conversation.context);

    // Prepare OpenAI messages
    const openaiMessages: any[] = [
      {
        role: 'system',
        content: contextPrompt
      }
    ];

    // Add the current message to OpenAI
    const currentMessage: any = {
      role: 'user',
      content: message || 'Please analyze this image'
    };

    // Add image if present
    if (imageUrl) {
      currentMessage.content = [
        {
          type: 'text',
          text: message || 'Please analyze this image in detail'
        },
        {
          type: 'image_url',
          image_url: {
            url: imageUrl,
            detail: 'high'
          }
        }
      ];
    }

    openaiMessages.push(currentMessage);

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: imageUrl ? 'gpt-4-vision-preview' : 'gpt-4',
      messages: openaiMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Add AI response to database
    const assistantMessage = await ChatService.addMessage(
      conversation.id,
      userId,
      aiResponse,
      'assistant'
    );

    // Update conversation context
    const updatedContext = `${conversation.context}\nUser: ${message || 'shared image'}. AI: ${aiResponse.substring(0, 200)}...`.slice(-1000);
    await ChatService.updateConversationContext(conversation.id, updatedContext, userId);

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      conversation: conversation
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
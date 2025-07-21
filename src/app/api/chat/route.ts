import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabase-server';
import openai from '../../../lib/openai';
import { ChatService } from '../../../lib/chat-service';
import { ImageUploadService } from '../../../lib/image-upload';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CHAT API DEBUG ===');
    
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

    const formData = await request.formData();
    const message = formData.get('message') as string;
    const conversationId = formData.get('conversationId') as string;
    const imageFile = formData.get('image') as File;

    if (!message && (!imageFile || imageFile.size === 0)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message or image is required' 
      }, { status: 400 });
    }

    let conversation;
    let imageUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
      try {
        console.log('Uploading image...');
        imageUrl = await ImageUploadService.uploadImage(imageFile, user.id);
        console.log('Image uploaded:', imageUrl);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to upload image' 
        }, { status: 500 });
      }
    }

    if (conversationId) {
      conversation = await ChatService.getConversation(conversationId, user.id);
      if (!conversation) {
        return NextResponse.json({ 
          success: false, 
          error: 'Conversation not found' 
        }, { status: 404 });
      }
    } else {
      const title = await ChatService.generateConversationTitle(message || 'Image Analysis');
      conversation = await ChatService.createConversation(user.id, title);
    }

    const userMessage = await ChatService.addMessage(
      conversation.id,
      user.id,
      message || 'Please analyze this image',
      'user',
      imageUrl
    );

    const messages = await ChatService.getConversationMessages(conversation.id, user.id);
    const contextPrompt = ChatService.buildContextPrompt(messages, conversation.context);

    const openaiMessages: any[] = [
      {
        role: 'system',
        content: contextPrompt
      }
    ];

    const currentMessage: any = {
      role: 'user',
      content: message || 'Please analyze this image'
    };

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

    console.log('Calling OpenAI...');

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

    console.log('AI response received, length:', aiResponse.length);

    const assistantMessage = await ChatService.addMessage(
      conversation.id,
      user.id,
      aiResponse,
      'assistant'
    );

    const updatedContext = `${conversation.context}\nUser: ${message || 'shared image'}. AI: ${aiResponse.substring(0, 200)}...`.slice(-1000);
    await ChatService.updateConversationContext(conversation.id, updatedContext, user.id);

    console.log('Returning AI response');

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
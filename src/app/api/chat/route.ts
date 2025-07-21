import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabase-server';
import { getGeminiModel } from '../../../lib/gemini';
import { ChatService } from '../../../lib/chat-service';
import { ImageUploadService } from '../../../lib/image-upload';

async function imageUrlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    
    const mimeType = response.headers.get('content-type') || 
                    ImageUploadService.getMimeTypeFromUrl(url);
    
    return { base64, mimeType };
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CHAT API DEBUG ===');
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google AI API key not configured' 
      }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
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

    console.log('Request data:', {
      hasMessage: !!message,
      messageLength: message?.length || 0,
      hasImageFile: !!(imageFile && imageFile.size > 0),
      imageSize: imageFile?.size || 0
    });

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

    console.log('User message saved:', userMessage.id);

    const messages = await ChatService.getConversationMessages(conversation.id, user.id);
    
    let contextPrompt: string;
    
    if (imageUrl) {
      contextPrompt = `You are an AI assistant specialized in analyzing images and providing detailed responses about their content. When analyzing images, be specific and detailed about what you observe.`;
    } else {
      contextPrompt = `You are a helpful AI assistant. Respond to the user's questions and requests in a helpful, accurate, and conversational manner. You can help with various topics including explanations, creative writing, problem-solving, and general conversation.`;
    }
    
    if (conversation.context) {
      contextPrompt += `\n\nConversation context: ${conversation.context}`;
    }
    
    if (messages.length > 1) {
      contextPrompt += `\n\nRecent conversation:`;
      messages.slice(-4).forEach((msg) => {
        if (msg.role !== 'system' && msg.id !== userMessage.id) {
          contextPrompt += `\n${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content.substring(0, 150)}`;
        }
      });
    }

    console.log('Calling Gemini AI...');
    console.log('Message type:', imageUrl ? 'Text + Image' : 'Text only');

    try {
      const model = getGeminiModel(!!imageUrl);
      let result;

      if (imageUrl && message) {
        console.log('Processing image + text with Gemini...');
        
        const { base64, mimeType } = await imageUrlToBase64(imageUrl);
        
        const prompt = `${contextPrompt}\n\nUser's message about the image: ${message}\n\nPlease analyze the image and respond to the user's message.`;
        
        const imagePart = {
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        };

        result = await model.generateContent([prompt, imagePart]);
        
      } else if (imageUrl && !message) {
        console.log('Processing image only with Gemini...');
        
        const { base64, mimeType } = await imageUrlToBase64(imageUrl);
        
        const prompt = `${contextPrompt}\n\nPlease analyze this image in detail and describe what you see.`;
        
        const imagePart = {
          inlineData: {
            data: base64,
            mimeType: mimeType,
          },
        };

        result = await model.generateContent([prompt, imagePart]);
        
      } else {
        console.log('Processing text only with Gemini...');
        
        const prompt = `${contextPrompt}\n\nUser: ${message}\n\nPlease respond helpfully to the user's message.`;
        
        result = await model.generateContent(prompt);
      }

      const response = await result.response;
      
      if (response.promptFeedback && response.promptFeedback.blockReason) {
        console.log('Response blocked:', response.promptFeedback);
        throw new Error(`Response blocked: ${response.promptFeedback.blockReason}`);
      }

      const aiResponse = response.text();

      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error('Empty response from Gemini AI');
      }

      console.log('Gemini AI response received, length:', aiResponse.length);

      const assistantMessage = await ChatService.addMessage(
        conversation.id,
        user.id,
        aiResponse,
        'assistant'
      );

      console.log('AI message saved:', assistantMessage.id);

      const updatedContext = `${conversation.context}\nUser: ${(message || 'shared image').substring(0, 100)}. AI: ${aiResponse.substring(0, 200)}...`.slice(-800);
      await ChatService.updateConversationContext(conversation.id, updatedContext, user.id);

      console.log('Returning both messages');

      return NextResponse.json({
        success: true,
        messages: [userMessage, assistantMessage],
        conversation: conversation
      });

    } catch (aiError: any) {
      console.error('Gemini AI error:', aiError);
      
      const fallbackResponse = imageUrl 
        ? 'I can see you shared an image, but I\'m having trouble analyzing it right now. Could you describe what you\'d like me to help you with?'
        : 'I\'m having trouble processing your request right now. Could you please try again or rephrase your question?';

      const assistantMessage = await ChatService.addMessage(
        conversation.id,
        user.id,
        fallbackResponse,
        'assistant'
      );

      return NextResponse.json({
        success: true,
        messages: [userMessage, assistantMessage],
        conversation: conversation,
        warning: 'AI service temporarily unavailable'
      });
    }

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
import { supabaseAdmin } from './supabase-server';

export class ImageUploadService {
  static async uploadImage(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from('chat-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('chat-images')
      .getPublicUrl(data.path);

    return publicUrl;
  }

  static async deleteImage(url: string): Promise<void> {
    const urlPath = new URL(url).pathname;
    const path = urlPath.split('/').slice(-2).join('/');
    
    if (path) {
      await supabaseAdmin.storage
        .from('chat-images')
        .remove([path]);
    }
  }

  static getMimeTypeFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'bmp': 'image/bmp'
    };
    return mimeTypes[extension || ''] || 'image/jpeg';
  }
}
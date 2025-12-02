// src/lib/uploadHelpers.js
import { supabase } from './supabase'

// Upload image to product-images bucket
export const uploadImage = async (file, folder = 'products') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'products') => {
  try {
    const uploadPromises = Array.from(files).map(file => 
      uploadImage(file, folder)
    )
    
    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw error
  }
}

// Delete image from product-images bucket
export const deleteImage = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split('product-images/')
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL')
    }
    
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])

    if (error) throw error

    console.log('Image deleted successfully')
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Delete multiple images
export const deleteMultipleImages = async (imageUrls) => {
  try {
    const filePaths = imageUrls.map(url => {
      const urlParts = url.split('product-images/')
      return urlParts[1]
    }).filter(Boolean)

    if (filePaths.length === 0) return

    const { error } = await supabase.storage
      .from('product-images')
      .remove(filePaths)

    if (error) throw error

    console.log('Images deleted successfully')
  } catch (error) {
    console.error('Error deleting multiple images:', error)
    throw error
  }
}

// ========== AVATAR FUNCTIONS ==========

// Upload avatar to avatars bucket
export const uploadAvatar = async (file, userId) => {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.')
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    console.log('📤 Uploading avatar:', fileName)

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Upload error:', error)
      throw error
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    console.log('✅ Avatar uploaded:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('❌ Error uploading avatar:', error)
    throw error
  }
}

// Delete avatar from avatars bucket
export const deleteAvatar = async (avatarUrl) => {
  try {
    if (!avatarUrl) return

    const urlParts = avatarUrl.split('avatars/')
    if (urlParts.length < 2) {
      console.warn('Invalid avatar URL format')
      return
    }
    
    const filePath = urlParts[1]

    console.log('🗑️ Deleting old avatar:', filePath)

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath])

    if (error) {
      console.error('❌ Delete error:', error)
      throw error
    }

    console.log('✅ Old avatar deleted')
  } catch (error) {
    console.error('❌ Error deleting avatar:', error)
    // Don't throw - deletion failure shouldn't block upload
  }
}
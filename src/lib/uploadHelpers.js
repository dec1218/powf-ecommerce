// src/lib/uploadHelpers.js
import { supabase } from './supabase'

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
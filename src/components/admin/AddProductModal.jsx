import { useState } from 'react'
import { uploadMultipleImages } from '../../lib/uploadHelpers'



const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    price2: '',
    stock: '',
    description: '',
    images: []
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  const categories = ['Foods', 'Toys', 'Grooming Tools', 'Accessories']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3) // Max 3 images
    setImageFiles(files)

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index])
    
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async () => {
    if (!formData.productName || !formData.category || !formData.price || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setUploading(true)

      // Upload images to Supabase Storage
      let imageUrls = []
      if (imageFiles.length > 0) {
        imageUrls = await uploadMultipleImages(imageFiles, 'products')
        console.log('✅ Images uploaded:', imageUrls)
      }

      // Prepare product data with image URLs
      const productData = {
        ...formData,
        images: imageUrls
      }

      // Call parent save function
      onSave(productData)

      // Clean up
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      
      // Reset form
      setFormData({
        productName: '',
        category: '',
        price: '',
        price2: '',
        stock: '',
        description: '',
        images: []
      })
      setImageFiles([])
      setImagePreviews([])
    } catch (error) {
      console.error('❌ Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    // Clean up preview URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url))
    
    // Reset form
    setFormData({
      productName: '',
      category: '',
      price: '',
      price2: '',
      stock: '',
      description: '',
      images: []
    })
    setImageFiles([])
    setImagePreviews([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-amber-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-amber-900">
              Add New Product
            </h2>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="text-amber-600 hover:text-amber-900 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <form className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-amber-900 font-medium mb-2">
                  Product Name: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-amber-900 font-medium mb-2">
                  Category: <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Price: <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="0"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Sale Price (Optional):
                  </label>
                  <input
                    type="number"
                    value={formData.price2}
                    onChange={(e) => handleInputChange('price2', e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="0"
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-amber-900 font-medium mb-2">
                    Stock:
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    placeholder="0"
                    step="1"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-amber-900 font-medium mb-2">
                  Images: (Max 3 images)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="aspect-square border-2 border-dashed border-amber-300 rounded-lg flex items-center justify-center bg-amber-50 hover:bg-amber-100 transition-colors duration-200 cursor-pointer relative overflow-hidden"
                    >
                      {imagePreviews[index] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreviews[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={uploading}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="w-12 h-12 text-amber-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm text-amber-600">Add Image</span>
                        </div>
                      )}
                      {index === 0 && !uploading && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          multiple
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  Supported formats: JPG, PNG, GIF (Max 5MB per image)
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-amber-900 font-medium mb-2">
                  Description: <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={uploading}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
                  placeholder="Enter product description"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-amber-200 px-6 py-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploading}
              className="px-8 py-3 rounded-lg border-2 border-amber-300 text-amber-900 font-semibold hover:bg-amber-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="px-8 py-3 rounded-lg bg-amber-800 text-white font-semibold hover:bg-amber-900 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Save Product</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProductModal
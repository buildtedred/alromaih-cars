// Save a car to the wishlist in localStorage
export function addToWishlist(car) {
    try {
      // Get current wishlist
      const currentWishlist = getWishlist()
  
      // Check if car is already in wishlist
      if (!currentWishlist.some((item) => item.id === car.id)) {
        // Add car to wishlist
        const updatedWishlist = [...currentWishlist, car]
  
        // Save updated wishlist
        localStorage.setItem("carWishlist", JSON.stringify(updatedWishlist))
        return true
      }
      return false
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      return false
    }
  }
  
  // Remove a car from the wishlist
  export function removeFromWishlist(carId) {
    try {
      // Get current wishlist
      const currentWishlist = getWishlist()
  
      // Filter out the car to remove
      const updatedWishlist = currentWishlist.filter((car) => car.id !== carId)
  
      // Save updated wishlist
      localStorage.setItem("carWishlist", JSON.stringify(updatedWishlist))
      return true
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      return false
    }
  }
  
  // Get the current wishlist from localStorage
  export function getWishlist() {
    try {
      const savedWishlist = localStorage.getItem("carWishlist")
      return savedWishlist ? JSON.parse(savedWishlist) : []
    } catch (error) {
      console.error("Error getting wishlist:", error)
      return []
    }
  }
  
  // Check if a car is in the wishlist
  export function isInWishlist(carId) {
    try {
      const wishlist = getWishlist()
      return wishlist.some((car) => car.id === carId)
    } catch (error) {
      console.error("Error checking wishlist:", error)
      return false
    }
  }
  
  // Toggle a car in the wishlist (add if not present, remove if present)
  export function toggleWishlistItem(car) {
    if (isInWishlist(car.id)) {
      return removeFromWishlist(car.id)
    } else {
      return addToWishlist(car)
    }
  }
  
  // Clear the entire wishlist
  export function clearWishlist() {
    try {
      localStorage.removeItem("carWishlist")
      return true
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      return false
    }
  }
  
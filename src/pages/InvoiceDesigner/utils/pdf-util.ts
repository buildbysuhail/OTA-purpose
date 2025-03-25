// Standard page size dimensions in points
export const PAGE_DIMENSIONS = {
    A4: { width: 595, height: 842 },
    A5: { width: 420, height: 595 },
    A3: { width: 842, height: 1191 },
    LETTER: { width: 612, height: 792 },
    LEGAL: { width: 612, height: 1008 },
    TABLOID: { width: 792, height: 1224 },
    CUSTOM: { width: 0, height: 0 }, // Placeholder for custom sizes
  }
  
  export type PageSizeKey = keyof typeof PAGE_DIMENSIONS
  
  /**
   * Get page dimensions based on page size string
   * @param pageSize - The page size string (e.g., "A4", "LETTER", "CUSTOM")
   * @param customWidth - Custom width in points (used when pageSize is "CUSTOM")
   * @param customHeight - Custom height in points (used when pageSize is "CUSTOM")
   * @returns The page dimensions object with width and height properties
   */
  export const getPageDimensions = (pageSize = "A4", customWidth?: number | string, customHeight?: number | string) => {
    const upperCasePageSize = pageSize.toUpperCase() as PageSizeKey
  
    // Handle custom page size
    if (upperCasePageSize === "CUSTOM" && (customWidth || customHeight)) {
      return {
        width: Number(customWidth) || PAGE_DIMENSIONS.A4.width,
        height: Number(customHeight) || PAGE_DIMENSIONS.A4.height,
      }
    }
  
    // Return standard page dimensions or default to A4
    return PAGE_DIMENSIONS[upperCasePageSize] || PAGE_DIMENSIONS.A4
  }
  
  /**
   * Calculate content height based on page height and padding
   * @param pageHeight - The page height in points
   * @param paddingTop - The top padding in points
   * @param paddingBottom - The bottom padding in points
   * @returns The content height in points
   */
  export const calculateContentHeight = (pageHeight: number, paddingTop = 10, paddingBottom = 10) => {
    return pageHeight - paddingTop - paddingBottom
  }
  
  /**
   * Get the page size value for @react-pdf/renderer Page component
   * @param pageSize - The page size string (e.g., "A4", "LETTER", "CUSTOM")
   * @param dimensions - The page dimensions object with width and height properties
   * @returns The page size value for the Page component
   */
  export const getPageSizeForPDF = (pageSize: string, dimensions: { width: number; height: number }) => {
    if (pageSize.toUpperCase() === "CUSTOM") {
      return [dimensions.width, dimensions.height]
    }
    return pageSize as any
  }
  
  /**
   * Calculate page dimensions based on orientation
   * @param dimensions - The page dimensions object with width and height properties
   * @param orientation - The page orientation ("portrait" or "landscape")
   * @returns The page dimensions adjusted for orientation
   */
  export const getOrientedDimensions = (
    dimensions: { width: number; height: number },
    orientation: "portrait" | "landscape" = "portrait",
  ) => {
    if (orientation === "landscape") {
      return {
        width: dimensions.height,
        height: dimensions.width,
      }
    }
    return dimensions
  }
  
  /**
   * Calculate how many items can fit on a page
   * @param contentHeight - The available content height
   * @param itemHeight - The height of each item
   * @param itemMargin - The margin between items
   * @param maxItemsPerPage - The maximum number of items per page (optional)
   * @returns The number of items that can fit on a page
   */
  export const calculateItemsPerPage = (
    contentHeight: number,
    itemHeight: number,
    itemMargin = 0,
    maxItemsPerPage?: number,
  ) => {
    const totalItemHeight = itemHeight + itemMargin
    const itemsPerPage = Math.floor(contentHeight / totalItemHeight)
  
    if (maxItemsPerPage !== undefined) {
      return Math.min(itemsPerPage, maxItemsPerPage)
    }
  
    return itemsPerPage
  }
  
  /**
   * Group items into pages
   * @param items - The array of items to group
   * @param itemsPerPage - The number of items per page
   * @returns An array of arrays, where each inner array represents a page of items
   */
  export const groupItemsIntoPages = <T>(items: T[], itemsPerPage: number) => {
    const pages: T[][] = []
    
    for (let i = 0; i < items.length; i += itemsPerPage) {
      const pageItems = items.slice(i, i + itemsPerPage)
      pages.push(pageItems)
    }
    
    return pages
  }
  
  
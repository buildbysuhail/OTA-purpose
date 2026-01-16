import {
  Dispatch,
  FC,
  SetStateAction,
  lazy,
  Suspense,
} from "react";
import { getStorageString } from "../../../utilities/storage-utils";
import { ErrorBoundary } from "../../../pages/rpos/components/ErrorBoundary";

/**
 * ✅ PERFORMANCE OPTIMIZATION:
 * - Lazy loading for code splitting
 * - Suspense boundaries for better loading UX
 * - Error boundaries for graceful error handling
 */

// Lazy load components for code splitting
const RPosContent = lazy(() => import("../content/rpos-content"));
const RPosHeader = lazy(() => import("../header/rpos-header"));

interface RPosProps {
  setMyClass: Dispatch<SetStateAction<string>>;
}

/**
 * Header Loading Skeleton
 */
const HeaderSkeleton = () => (
  <header className="lg:h-[9vh] xl:h-[8vh] bg-white shadow-md p-2 flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
      <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
      <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
      <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="flex items-center space-x-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      ))}
    </div>
  </header>
);

/**
 * Content Loading Skeleton
 */
const ContentSkeleton = () => (
  <div className="flex h-[91vh] xl:h-[92vh] bg-gray-200 animate-pulse">
    {/* Sidebar skeleton */}
    <div className="w-48 bg-gray-300 p-2 space-y-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-400 rounded" />
      ))}
    </div>

    {/* Product grid skeleton */}
    <div className="flex-1 p-4">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-300 rounded" />
        ))}
      </div>
    </div>

    {/* Order panel skeleton */}
    <div className="w-[43%] bg-white p-4 space-y-4">
      <div className="h-12 bg-gray-200 rounded" />
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  </div>
);

/**
 * RPOS Layout Component - Optimized with Suspense & Error Boundaries
 */
const RPosLayout: FC<RPosProps> = ({ setMyClass }) => {
  /**
   * Handle body click for sidebar collapse
   */
  const handleBodyClick = async () => {
    const isChecked = await getStorageString("ynexverticalstyles");
    if (isChecked === "icontext") {
      setMyClass("");
    }

    if (window.innerWidth > 992) {
      const html = document.documentElement;
      if (html.getAttribute('icon-overlay') === 'open') {
        html.setAttribute('icon-overlay', "");
      }
    }
  };

  return (
    <ErrorBoundary>
      {/* Header with Suspense */}
      <Suspense fallback={<HeaderSkeleton />}>
        <RPosHeader />
      </Suspense>

      {/* Content with Suspense */}
      <div className="content content-rpos main-index">
        <div onClick={handleBodyClick}>
          <Suspense fallback={<ContentSkeleton />}>
            <ErrorBoundary
              fallback={
                <div className="flex items-center justify-center h-[91vh] bg-gray-50">
                  <div className="text-center">
                    <i className="ri-error-warning-line text-red-500 text-6xl mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Failed to load RPOS
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Please refresh the page or contact support.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              }
            >
              <RPosContent />
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RPosLayout;


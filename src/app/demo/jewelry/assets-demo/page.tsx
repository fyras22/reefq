import DiamondViewer from '@/components/diamonds/DiamondViewer';
import ProductGallery from '@/components/products/ProductGallery';
import { DiamondCut, JewelryType, sampleProducts } from '@/lib/assets/MediaAssets';

export default function AssetsDemo() {
  // Get sample product for demo
  const ringProduct = sampleProducts.rings['diamond-solitaire'];
  const necklaceProduct = sampleProducts.necklaces['diamond-pendant'];
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Assets Demonstration
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          This page demonstrates how assets are used in the jewelry showcase components.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Diamond Viewer */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Diamond Viewer</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <DiamondViewer initialCut={DiamondCut.ROUND} />
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About This Component</h3>
              <p className="text-gray-600 text-sm">
                The Diamond Viewer component allows customers to explore different diamond cuts
                and view angles. It intelligently handles missing assets with fallbacks and
                provides an interactive way to visualize diamonds.
              </p>
            </div>
          </div>
        </div>
        
        {/* Product Gallery */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Gallery</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ProductGallery product={ringProduct} />
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About This Component</h3>
              <p className="text-gray-600 text-sm">
                The Product Gallery component showcases jewelry items with multiple view angles
                and supports 3D model viewing. It includes thumbnail navigation and AR viewing
                options for compatible devices.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Multiple Product Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Ring Product */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ProductGallery product={ringProduct} showModelViewer={false} />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Diamond Solitaire Ring</h3>
              <p className="text-gray-600 text-sm mt-1">
                Classic elegant design with a brilliant round-cut diamond.
              </p>
            </div>
          </div>
          
          {/* Necklace Product */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ProductGallery product={necklaceProduct} showModelViewer={false} />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Diamond Pendant</h3>
              <p className="text-gray-600 text-sm mt-1">
                Delicate pendant necklace featuring a sparkling diamond centerpiece.
              </p>
            </div>
          </div>
          
          {/* Diamond Comparison */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <DiamondViewer initialCut={DiamondCut.EMERALD} showControls={false} />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Emerald Cut Diamond</h3>
              <p className="text-gray-600 text-sm mt-1">
                Sophisticated emerald cut with elegant step facets and vintage appeal.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Asset Generation Instructions</h2>
        <div className="prose max-w-none">
          <p>
            To generate placeholder assets for development, run:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>python scripts/generate-placeholder-images.py</code>
          </pre>
          
          <p className="mt-4">
            For production-quality assets, follow the detailed guide in:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>docs/ASSET_GENERATION_GUIDE.md</code>
          </pre>
          
          <p className="mt-4">
            All assets are accessed through the Media Assets Manager:
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>src/lib/assets/MediaAssets.ts</code>
          </pre>
        </div>
      </div>
    </div>
  );
} 
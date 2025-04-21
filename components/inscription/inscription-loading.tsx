export default function InscriptionLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-secondary border-0 shadow-lg overflow-hidden rounded-xl">
        <div className="bg-secondary/50 border-b border-gray-700 p-6">
          <div className="h-8 w-1/3 bg-gray-700 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-700/50 rounded-md animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse mr-2"></div>
                <div className="h-6 w-40 bg-gray-700 rounded-md animate-pulse"></div>
              </div>
              <div className="h-20 bg-gray-700/50 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-700/50 rounded-md animate-pulse"></div>
              <div className="h-12 bg-gray-700/50 rounded-md animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse mr-2"></div>
                <div className="h-6 w-40 bg-gray-700 rounded-md animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-20 bg-gray-700/50 rounded-md animate-pulse"></div>
                <div className="h-20 bg-gray-700/50 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 bg-secondary/50 border-t border-gray-700">
          <div className="h-10 w-40 bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

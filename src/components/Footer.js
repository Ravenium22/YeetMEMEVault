export function Footer() {
    return (
      <footer className="py-6 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-amber-800 mb-4">Made by yeetarded community member</p>
          <div className="flex justify-center space-x-4">
            <a href="https://x.com/RaveniumNFT" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-amber-900 hover:text-amber-600 transition-colors">
              𝕏: @RaveniumNFT
            </a>
            <span className="text-amber-900">•</span>
            <span className="text-amber-900">
              Discord: ravenium22
            </span>
          </div>
        </div>
      </footer>
    );
  }
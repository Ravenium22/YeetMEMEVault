export function Footer() {
  return (
    <footer className="py-6 text-center bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
      <p className="text-amber-800 dark:text-amber-200 mb-2">Made by yeetarded community member</p>
      <div className="flex justify-center space-x-4">
        <a 
          href="https://x.com/RaveniumNFT" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-amber-900 dark:text-amber-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          𝕏: @RaveniumNFT
        </a>
        <span className="text-amber-900 dark:text-amber-100">•</span>
        <span className="text-amber-900 dark:text-amber-100">Discord: ravenium22</span>
      </div>
    </footer>
  );
}
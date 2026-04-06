import React from 'react'

const Footer = () => {
  return (
    <>
    {/* Footer */}
      <footer className="bg-gray-100 text-gray-500 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} KiranaNeeds. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
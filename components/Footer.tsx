const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-gray-800/50 py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} 4ZIGEN All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
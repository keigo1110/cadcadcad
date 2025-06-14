const DeveloperSection = () => {
  return (
    <section className="relative z-10 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Developed by
        </p>
        <p className="text-gray-400 mb-4">
          東京大学発のクリエイター集団
          <a
            href="https://4zigenhp.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white underline underline-offset-2 decoration-gray-600 hover:decoration-gray-400 transition-colors ml-1"
          >
            4ZIGEN
          </a>
        </p>
      </div>
    </section>
  );
};

export default DeveloperSection;
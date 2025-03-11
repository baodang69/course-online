// components/Footer.js
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 text-center">
      <div className="container mx-auto">
        <p className="text-sm">
          &copy; 2025 LMS Learning. All rights reserved.
        </p>
        <div className="mt-3 space-x-4">
          <Link to="/terms" className="text-gray-400 hover:underline">
            Điều khoản
          </Link>
          <Link to="/privacy" className="text-gray-400 hover:underline">
            Chính sách bảo mật
          </Link>
          <Link to="/contact" className="text-gray-400 hover:underline">
            Liên hệ
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

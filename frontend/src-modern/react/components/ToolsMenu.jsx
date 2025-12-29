import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaImage,
  FaMicrophone,
  FaVideo,
  FaFileImage,
  FaVideoSlash,
  FaRobot,
  FaCode,
  FaCube,
} from "react-icons/fa";

function ToolsMenu({ sidebarActive, setSidebarActive }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      id: 1,
      name: "Text 2 Image",
      icon: <FaImage />,
      path: "/text-to-image",
    },
    {
      id: 2,
      name: "Text 2 Speech",
      icon: <FaMicrophone />,
      path: "/text-to-speech",
    },
    {
      id: 3,
      name: "Text 2 Video",
      icon: <FaVideo />,
      path: "/text-to-video",
    },
    {
      id: 4,
      name: "Image 2 Text",
      icon: <FaFileImage />,
      path: "/image-to-text",
    },
    {
      id: 5,
      name: "Image 2 Video",
      icon: <FaVideoSlash />,
      path: "/image-to-video",
    },
    {
      id: 6,
      name: "AI Chat GPT",
      icon: <FaRobot />,
      path: "/ai-chatgpt",
    },
    {
      id: 7,
      name: "AI Deepseek",
      icon: <FaCode />,
      path: "/ai-deepseek",
    },
    {
      id: 8,
      name: "AI BlackBox",
      icon: <FaCube />,
      path: "/ai-blackbox",
    },
  ];

  return (
    <div className="tools-menu-wrapper">
      {/* Tools Menu Button */}
      <button
        className="nav-link d-flex align-items-center justify-content-between text-white text-opacity-75 hover-bg-primary hover-bg-opacity-10 rounded py-2 w-100 border-0 bg-transparent"
        onClick={toggleMenu}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center">
          <FaRobot className="me-3" />
          <span className="fw-semibold">Tools Menu</span>
        </div>
        {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="tools-dropdown-content mt-2">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item mb-2">
                <Link
                  className="nav-link d-flex align-items-center text-white text-opacity-75 hover-bg-primary hover-bg-opacity-10 rounded py-2"
                  to={`/tools/${item.path}`}
                  onClick={() =>
                    setSidebarActive(item.name.toLowerCase().replace(" ", "-"))
                  }
                  style={{
                    fontSize: "0.875rem",
                    paddingLeft: "1.5rem",
                    paddingRight: "1rem",
                  }}
                >
                  <span className="me-3" style={{ minWidth: "20px" }}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .tools-menu-wrapper {
          width: 100%;
        }

        .tools-dropdown-content {
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-link:hover {
          background-color: rgba(69, 72, 245, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default ToolsMenu;

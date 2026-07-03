import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="dashboard-footer">
      <div className="footer-content">
        <p className="footer-title">&copy; 2026 Smart Finance Dashboard</p>
        <p>Designed &amp; Developed by Aditya Yadav</p>
        <p className="footer-stack">
          Made with <span aria-label="love" role="img">&#10084;&#65039;</span> using
          <span>React &bull; Node.js &bull; Express.js &bull; MongoDB</span>
        </p>
        <div className="footer-socials" aria-label="Social links">
          <a
            aria-label="GitHub profile"
            href="https://github.com/aditya22439"
            rel="noreferrer"
            target="_blank"
          >
            <FaGithub />
          </a>
          <a
            aria-label="LinkedIn profile"
            href="https://linkedin.com/in/aditya-yadav"
            rel="noreferrer"
            target="_blank"
          >
            <FaLinkedin />
          </a>
        </div>
        <p className="footer-version">Version 1.0</p>
      </div>
    </footer>
  );
}

export default Footer;

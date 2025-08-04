import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiDocumentText,
  HiUserCircle,
  HiLockClosed,
  HiBell,
  HiDeviceMobile,
  HiClipboardCheck,
  HiMenu,
  HiX,
} from 'react-icons/hi';

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Navbar */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="MediScript Logo" className="h-10 w-auto" />
            <span className="text-blue-600 font-bold text-2xl">MediScript</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 text-medium">
            <a href="#main" className="px-5 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition">Home</a>
            <a href="#about" className="px-5 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition">About</a>
            <a href="#how-works" className="px-5 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition">How it Works</a>
            <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">Login / Register</Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-blue-600 text-3xl">
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 bg-white shadow">
            <div className="flex flex-col space-y-2">
              <a href="#main" className="block px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">Home</a>
              <a href="#about" className="block px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">About</a>
              <a href="#how-works" className="block px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">How it Works</a>
              <Link to="/login" className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Login / Register</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="main" className="bg-blue-600 text-white py-20 px-4 text-center relative">
        <img src="https://cdn.pixabay.com/photo/2014/12/10/21/01/doctor-563428_1280.jpg" alt="Doctor" className="absolute inset-0 object-cover w-full h-full opacity-20 z-0" />
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Digital Doctor Prescription Platform</h1>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">Seamless and secure way for doctors to prescribe and patients to access prescriptions online.</p>
          <Link to="/login">
            <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-200 transition">Get Started</button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">About Our Platform</h2>
          <p className="text-lg text-gray-700">
            Our web-based system allows doctors to write, manage, and send prescriptions digitally. Patients can securely view and download their prescriptions anytime. We aim to modernize healthcare communication while ensuring compliance, security, and ease of access.
          </p>
        </div>
        <div>
          <img src="https://cdn.pixabay.com/photo/2019/04/03/03/06/treatment-4099432_1280.jpg" alt="Prescription" className="rounded-lg shadow-lg w-full" />
        </div>
      </section>

      {/* Features */}
     <section className="bg-white py-16 px-6">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-semibold text-center mb-12">Key Features</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          icon: <HiDocumentText size={40} className="text-blue-600" />,
          title: "E-Prescription",
          desc: "Generate and share prescriptions instantly.",
        },
        {
          icon: <HiUserCircle size={40} className="text-blue-600" />,
          title: "Patient History",
          desc: "Access past prescriptions and medical notes.",
        },
        {
          icon: <HiLockClosed size={40} className="text-blue-600" />,
          title: "Secure Login",
          desc: "HIPAA-compliant and encrypted data access.",
        },
        {
          icon: <HiClipboardCheck size={40} className="text-blue-600" />,
          title: "Doctor Dashboard",
          desc: "Manage appointments and prescriptions.",
        },
        {
          icon: <HiBell size={40} className="text-blue-600" />,
          title: "Notification Alerts",
          desc: "Get notified for upcoming appointments or prescriptions.",
        },
        {
          icon: <HiDeviceMobile size={40} className="text-blue-600" />,
          title: "Mobile Friendly",
          desc: "Accessible on desktop and mobile devices.",
        },
      ].map((feature, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-6 shadow hover:shadow-lg transition"
        >
          <div className="flex items-center gap-4 mb-3">
            <div>{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
          </div>
          <p className="text-gray-600 pl-14">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>


<section id="how-works" className="py-8 px-4 bg-white">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-semibold mb-10">How It Works</h2>
    <ol className="relative border-l border-blue-300 mx-auto sm:ml-10">
      {[
        {
          icon: <HiLockClosed className="text-white" size={20} />,
          title: "Login",
          desc: "Doctor logs in with secure credentials.",
        },
        {
          icon: <HiDocumentText className="text-white" size={20} />,
          title: "Create Prescription",
          desc: "Fill out patient and medication details.",
        },
        {
          icon: <HiClipboardCheck className="text-white" size={20} />,
          title: "Share & Save",
          desc: "Prescription sent to patient securely.",
        },
      ].map((step, idx) => (
        <li
          className="group mb-4 ml-6 transition-transform transform hover:scale-[1.02] hover:bg-blue-50 rounded-lg p-4 sm:p-6"
          key={idx}
        >
          <span className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full absolute -left-5 ring-4 ring-white shadow-lg group-hover:ring-blue-300 transition">
            {step.icon}
          </span>
          <h3 className="text-lg font-semibold text-blue-700 mt-1 group-hover:text-blue-900">{`${idx + 1}. ${step.title}`}</h3>
          <p className="text-gray-700 mt-2 text-sm group-hover:text-gray-900">{step.desc}</p>
        </li>
      ))}
    </ol>
  </div>
</section>



      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to simplify your prescriptions?</h2>
        <p className="text-lg mb-6">Start using our secure and efficient platform today.</p>
        <Link to="/login">
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition">Sign Up Now</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Doctor Prescription System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

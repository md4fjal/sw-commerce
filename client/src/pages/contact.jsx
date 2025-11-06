import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaPaperPlane,
  FaClock,
  FaWhatsapp,
  FaHeadset,
  FaShippingFast,
  FaExchangeAlt,
  FaGlobe,
  FaStar,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [loading, setLoading] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call with better UX
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setIsSubmitted(true);
    toast.success(
      "🎉 Message sent successfully! We'll contact you within 24 hours."
    );

    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const contactInfo = [
    {
      icon: FaHeadset,
      title: "Customer Support",
      details: "+1 (555) 123-4567",
      description: "24/7 dedicated support line",
      color: "from-blue-500 to-blue-600",
      action: "Call Now",
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp",
      details: "+1 (555) 987-6543",
      description: "Instant messaging support",
      color: "from-green-500 to-green-600",
      action: "Message",
    },
    {
      icon: FaEnvelope,
      title: "Email Support",
      details: "support@ecommerce.com",
      description: "Typically replies within 2 hours",
      color: "from-purple-500 to-purple-600",
      action: "Email",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Our Store",
      details: "123 Commerce Street, Suite 100",
      description: "New York, NY 10001",
      color: "from-orange-500 to-orange-600",
      action: "Get Directions",
    },
  ];

  const features = [
    {
      icon: FaShippingFast,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: FaExchangeAlt,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Always here to help",
    },
    {
      icon: FaGlobe,
      title: "Worldwide",
      description: "Global shipping available",
    },
  ];

  const faqItems = [
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for delivery within 1-2 business days. International shipping typically takes 7-14 business days depending on the destination.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all items in original condition. Items must be unused with tags attached. Refunds are processed within 5-7 business days after we receive your return.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by location. Customs fees may apply depending on your country's regulations.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'Order History' section.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay for your convenience.",
    },
    {
      question: "Do you offer price matching?",
      answer:
        "Yes, we offer a 7-day price match guarantee. If you find the same item at a lower price within 7 days of purchase, contact us with the details and we'll refund the difference.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <FaHeadset className="text-3xl text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <FaCheck className="text-white text-sm" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            We're Here to Help
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Get in touch with our dedicated support team. We're available 24/7
            to assist you with any questions about your orders, products, or
            account.
          </p>
        </motion.div>

        {/* Features Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <feature.icon className="text-2xl text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="text-xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-900 font-semibold text-lg mb-1">
                      {item.details}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      {item.description}
                    </p>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center space-x-1 group-hover:underline">
                      <span>{item.action}</span>
                      <FaPaperPlane className="text-xs transform group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Customer Reviews Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center space-x-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-300" />
                ))}
                <span className="font-bold text-lg">4.9/5</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Customer Satisfaction</h4>
              <p className="text-blue-100 text-sm mb-4">
                "Outstanding support! They resolved my issue in minutes. Highly
                recommended!"
              </p>
              <p className="text-blue-200 text-xs">
                - Sarah Johnson, Verified Customer
              </p>
            </motion.div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 relative overflow-hidden"
            >
              {/* Success State */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center z-10"
                  >
                    <div className="text-center text-white p-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <FaCheck className="text-3xl text-green-600" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-green-100">
                        We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h3>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm focus:shadow-md"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm focus:shadow-md"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Category and Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm focus:shadow-md appearance-none"
                      disabled={loading}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="orders">Order Support</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Issue</option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm focus:shadow-md"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help you... Please include any relevant order numbers or details."
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm focus:shadow-md resize-none"
                    required
                    disabled={loading}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg">Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <FaPaperPlane className="text-sm" />
                      <span className="text-lg">Send Message</span>
                    </div>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Enhanced FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors duration-200"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-blue-50 transition-colors duration-200"
                    >
                      <span className="font-semibold text-gray-900 text-lg">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: activeFAQ === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown className="text-gray-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {activeFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

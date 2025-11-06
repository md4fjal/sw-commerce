import React from "react";
import {
  FaRocket,
  FaUsers,
  FaAward,
  FaGlobeAmericas,
  FaHeart,
  FaShoppingBag,
  FaLeaf,
  FaShieldAlt,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaTrophy,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: FaUsers },
    { number: "100+", label: "Countries Served", icon: FaGlobeAmericas },
    { number: "98%", label: "Satisfaction Rate", icon: FaAward },
    { number: "24/7", label: "Customer Support", icon: FaHeart },
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: "Trust & Quality",
      description:
        "Every product is carefully curated and quality-tested to ensure excellence.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FaLeaf,
      title: "Sustainability",
      description:
        "Committed to eco-friendly practices and sustainable sourcing.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FaRocket,
      title: "Innovation",
      description:
        "Constantly evolving to bring you the latest trends and technologies.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FaHandHoldingHeart,
      title: "Community",
      description: "Building relationships and giving back to our communities.",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image: "👩‍💼",
      description: "Former retail executive with 15+ years of experience",
      color: "bg-blue-100",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Operations",
      image: "👨‍💼",
      description: "Supply chain and logistics expert",
      color: "bg-green-100",
    },
    {
      name: "Emily Watson",
      role: "Creative Director",
      image: "👩‍🎨",
      description: "Award-winning designer and brand strategist",
      color: "bg-purple-100",
    },
    {
      name: "David Kim",
      role: "CTO",
      image: "👨‍💻",
      description: "Tech innovator and ecommerce specialist",
      color: "bg-orange-100",
    },
  ];

  const milestones = [
    { year: "2018", event: "Founded with a vision to revolutionize ecommerce" },
    { year: "2019", event: "Reached 10,000 customers and expanded globally" },
    { year: "2020", event: "Launched mobile app and achieved 1M+ downloads" },
    { year: "2021", event: "Recognized as 'Best Ecommerce Platform' award" },
    { year: "2022", event: "Expanded to 100+ countries worldwide" },
    { year: "2023", event: "Reached 50K+ happy customers milestone" },
  ];

  const testimonials = [
    {
      quote:
        "This platform transformed how I shop online. The quality and service are exceptional!",
      author: "Jessica Miller",
      role: "Premium Customer",
      rating: 5,
    },
    {
      quote:
        "Outstanding customer support and fast shipping. My go-to for all online shopping.",
      author: "Michael Thompson",
      role: "Loyal Customer",
      rating: 5,
    },
    {
      quote:
        "The product curation is amazing. I always find exactly what I'm looking for.",
      author: "Sophia Williams",
      role: "Fashion Enthusiast",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <FaShoppingBag className="text-3xl text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              From a simple idea to a global ecommerce platform trusted by
              thousands. We're passionate about bringing you the best shopping
              experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get In Touch</span>
                <FaArrowRight className="text-sm" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-white text-gray-900 border border-gray-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2018, we started with a simple mission: to create an
                ecommerce platform that puts customers first. What began as a
                small startup has grown into a global community of passionate
                shoppers and dedicated team members.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Today, we're proud to serve customers in over 100 countries,
                offering carefully curated products, exceptional customer
                service, and a seamless shopping experience that you can trust.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-semibold">
                  4.9/5 (10,000+ Reviews)
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                <p className="text-lg mb-6 leading-relaxed">
                  To revolutionize online shopping by providing exceptional
                  quality, unparalleled customer service, and a platform that
                  inspires trust and delight in every interaction.
                </p>
                <div className="flex items-center space-x-2">
                  <FaTrophy className="text-yellow-300" />
                  <span className="font-semibold">
                    Award-winning service since 2019
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and shape our company
              culture.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Milestones that shaped our growth
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-600 h-full"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`w-1/2 ${
                    index % 2 === 0 ? "pr-8 text-right" : "pl-8"
                  }`}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">
                      {milestone.year}
                    </h3>
                    <p className="text-gray-700">{milestone.event}</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind our success story
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:translate-y-[-8px] group"
              >
                <div
                  className={`w-24 h-24 ${member.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <FaQuoteLeft className="text-blue-500 text-2xl mb-4" />
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their
              shopping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Start Shopping Now
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
              >
                Contact Our Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

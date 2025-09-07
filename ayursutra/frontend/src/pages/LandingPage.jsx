import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Heart, 
  Calendar, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  Award,
  Sparkles,
  Brain
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: "Personalized Panchakarma",
      description: "Tailored Ayurvedic treatments based on your unique constitution and health needs"
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Smart Scheduling",
      description: "AI-powered appointment scheduling that optimizes your treatment timeline"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI-Driven Insights",
      description: "Advanced analytics to track your progress and predict treatment outcomes"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Expert Practitioners",
      description: "Connect with certified Ayurvedic doctors and experienced therapists"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security"
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-600" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for your wellness journey"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      image: "👩‍💻",
      rating: 5,
      text: "AyurSutra transformed my health completely. The personalized Panchakarma treatment helped me overcome chronic stress and digestive issues."
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      image: "👨‍💼",
      rating: 5,
      text: "The AI-powered scheduling made it so easy to fit treatments into my busy schedule. Highly recommend!"
    },
    {
      name: "Dr. Meera Patel",
      role: "Ayurvedic Practitioner",
      image: "👩‍⚕️",
      rating: 5,
      text: "As a practitioner, AyurSutra's platform helps me provide better care with detailed patient insights and treatment tracking."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Patients" },
    { number: "500+", label: "Expert Practitioners" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Treatment Types" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">AyurSutra</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-green-600 transition-colors">Contact</a>
              <Link 
                to="/login" 
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <span className="text-green-600 font-semibold">Ancient Wisdom, Modern Technology</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Health with 
                <span className="text-green-600"> AyurSutra</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience the power of personalized Panchakarma treatments guided by AI technology. 
                Join thousands who have discovered holistic wellness through authentic Ayurvedic care.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register" 
                  className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold text-lg"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center font-semibold text-lg"
                >
                  I'm Already a Member
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Wellness Score</h3>
                      <p className="text-sm text-gray-600">Your health progress</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-sm text-gray-600">85% - Excellent Progress!</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-white">
                    <Calendar className="h-6 w-6 mb-2" />
                    <p className="text-sm opacity-90">Next Session</p>
                    <p className="font-semibold">Tomorrow 10 AM</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-white">
                    <Award className="h-6 w-6 mb-2" />
                    <p className="text-sm opacity-90">Phase</p>
                    <p className="font-semibold">Pradhankarma</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AyurSutra?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining 5000-year-old Ayurvedic wisdom with cutting-edge technology 
              to deliver personalized healthcare solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Science of Panchakarma
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Panchakarma is Ayurveda's premier detoxification and rejuvenation program. 
                Our platform makes this ancient healing system accessible through modern technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Purvakarma (Preparation)</h4>
                    <p className="text-gray-600">Gentle preparation of the body for detoxification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Pradhankarma (Main Treatment)</h4>
                    <p className="text-gray-600">Five therapeutic procedures for deep cleansing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Paschatkarma (Recovery)</h4>
                    <p className="text-gray-600">Rejuvenation and lifestyle guidance for lasting wellness</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🧘‍♀️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Holistic Wellness</h3>
                <p className="text-gray-600 mb-6">
                  Experience balance in mind, body, and spirit through personalized Ayurvedic treatments
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-2">🌿</div>
                    <p className="text-sm font-medium">Natural</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">⚖️</div>
                    <p className="text-sm font-medium">Balanced</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">✨</div>
                    <p className="text-sm font-medium">Transformative</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who have transformed their lives with AyurSutra
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join AyurSutra today and experience the transformative power of personalized Ayurvedic care
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/register" 
              className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-colors font-semibold text-lg inline-flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold">AyurSutra</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transforming lives through authentic Ayurvedic care and modern technology.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Panchakarma Treatments</li>
                <li>Consultation Booking</li>
                <li>Progress Tracking</li>
                <li>AI Health Insights</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Our Practitioners</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@ayursutra.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AyurSutra. All rights reserved. Made with ❤️ for holistic wellness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

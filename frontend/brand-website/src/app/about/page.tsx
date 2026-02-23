import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="tech-gradient py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About BotMedia</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Leading the conversation in robotics technology and innovation
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                BotMedia is dedicated to bridging the gap between cutting-edge robotics technology and
                the people who are shaping our automated future. We believe that understanding robotics
                is essential for everyone in today's rapidly evolving technological landscape.
              </p>
              <p>
                Our platform serves as a comprehensive resource for robotics enthusiasts, industry
                professionals, and decision-makers seeking reliable information about the latest
                developments in robotics and automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="section-padding bg-slate-800">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News Coverage */}
            <div className="bg-slate-900 rounded-lg p-8 border border-gray-700">
              <div className="w-16 h-16 tech-gradient rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Industry News</h3>
              <p className="text-gray-300">
                We provide timely coverage of the latest developments, breakthroughs, and trends in
                the robotics industry, keeping you informed about what matters most.
              </p>
            </div>

            {/* Product Reviews */}
            <div className="bg-slate-900 rounded-lg p-8 border border-gray-700">
              <div className="w-16 h-16 tech-gradient rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Product Reviews</h3>
              <p className="text-gray-300">
                Our comprehensive product reviews help you make informed decisions about robotics
                solutions, featuring detailed analysis and real-world performance insights.
              </p>
            </div>

            {/* Expert Insights */}
            <div className="bg-slate-900 rounded-lg p-8 border border-gray-700">
              <div className="w-16 h-16 tech-gradient rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Expert Insights</h3>
              <p className="text-gray-300">
                We share deep industry knowledge and expert perspectives on emerging technologies,
                market trends, and the future of robotics and automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Focus Areas */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">Technology Focus Areas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Industrial Automation',
              'Collaborative Robots (Cobots)',
              'Autonomous Mobile Robots',
              'Humanoid Robotics',
              'AI & Machine Learning in Robotics',
              'Computer Vision & Sensing',
              'Robot Operating Systems',
              'IoT & Connected Robotics',
            ].map((area, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-lg p-6 border border-gray-700 flex items-center space-x-4"
              >
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <span className="text-lg text-white font-semibold">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (Placeholder) */}
      <section className="section-padding bg-slate-800">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">Our Team</h2>
            <p className="text-xl text-gray-300">
              Our team consists of robotics engineers, technology journalists, and industry experts
              passionate about advancing the field of robotics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="text-center">
                <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-primary/20">
                  <span className="text-gray-500 text-sm">Team Member</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Team Member {member}</h3>
                <p className="text-gray-400">Position Title</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-8">
            Interested in collaborating or have questions? We'd love to hear from you.
          </p>
          <div className="space-y-4 text-lg text-gray-300 mb-8">
            <p>
              <strong className="text-white">Email:</strong> contact@botmedia.com
            </p>
            <p>
              <strong className="text-white">Phone:</strong> +86 123-4567-8900
            </p>
            <p>
              <strong className="text-white">Address:</strong> Beijing, China
            </p>
          </div>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

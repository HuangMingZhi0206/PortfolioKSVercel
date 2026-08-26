import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Phone, MapPin, Send, Linkedin, Github, Instagram, MessageCircle } from 'lucide-react'
import { useApiData } from '../hooks/useApiData'
import { API_URL } from '../config/api'
import { SITE } from '../constants'
import SectionHeader from './ui/SectionHeader'

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' }

const FIELDS = [
  { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
  { name: 'email', label: 'Your Email', type: 'email', placeholder: 'john@example.com' },
  { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Project Collaboration' },
]

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const about = useApiData('/about')
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [status, setStatus] = useState({ loading: false, success: false, error: null })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: null })

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus({ loading: false, success: true, error: null })
        setFormData(EMPTY_FORM)
        setTimeout(() => setStatus({ loading: false, success: false, error: null }), 5000)
      } else {
        const data = await response.json()
        setStatus({ loading: false, success: false, error: data.message || 'Failed to send message' })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setStatus({ loading: false, success: false, error: 'Network error. Please try again.' })
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: about?.phone || '0895332606621', href: `tel:${about?.phone || '+62895332606621'}` },
    { icon: Mail, label: 'Email', value: about?.email || SITE.email, href: `mailto:${about?.email || SITE.email}` },
    { icon: MapPin, label: 'Location', value: about?.location || 'Indonesia', href: '#' },
  ]

  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', href: about?.linkedin_url || 'https://linkedin.com' },
    { icon: Github, label: 'GitHub', href: about?.github_url || 'https://github.com' },
    { icon: Instagram, label: 'Instagram', href: about?.instagram_url || 'https://instagram.com' },
    { icon: MessageCircle, label: 'WhatsApp', href: about?.phone ? `https://wa.me/${about.phone.replace(/\D/g, '')}` : 'https://wa.me/' },
  ]

  return (
    <section id="contact" className="relative py-16 md:py-28" ref={ref}>
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Get In"
          accent="Touch"
          description="Open to collaborations, project partnerships, and opportunities in Product Development, Robotics Engineering, IoT Solutions, and Technology Innovation."
          inView={isInView}
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="font-display text-2xl font-semibold mb-7">Let&apos;s Connect</h3>

            <div className="space-y-3.5 mb-8">
              {contactInfo.map((info) => (
                <a key={info.label} href={info.href} className="card card-hover p-4 flex items-center gap-4 block">
                  <div className="w-12 h-12 rounded-2xl bg-lotus-50 dark:bg-lotus-400/10 flex items-center justify-center shrink-0">
                    <info.icon size={22} className="text-lotus-600 dark:text-lotus-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-400 dark:text-slate-500">{info.label}</p>
                    <p className="font-medium truncate">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <p className="mb-4 text-slate-500 dark:text-slate-400">Follow me on social media</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full card flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-lotus-600 dark:hover:text-lotus-300 hover:-translate-y-0.5 transition-all"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            <div className="mt-10 card p-6 border-l-4 !border-l-lotus-400">
              <h4 className="font-display text-xl font-semibold mb-2">Let&apos;s build the future together!</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Whether you have a project in mind, want to collaborate, or just want to say hi,
                feel free to reach out. I&apos;m always excited to discuss new opportunities and ideas.
              </p>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <form onSubmit={handleSubmit} className="card p-8">
              <h3 className="font-display text-2xl font-semibold mb-6">Send a Message</h3>

              <div className="space-y-5">
                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm mb-2 text-slate-500 dark:text-slate-400">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="block text-sm mb-2 text-slate-500 dark:text-slate-400">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                {status.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-center text-sm"
                  >
                    ✓ Message sent successfully! I&apos;ll get back to you soon.
                  </motion.div>
                )}
                {status.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 text-center text-sm"
                  >
                    {status.error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className={`btn-primary w-full !py-4 ${status.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status.loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact

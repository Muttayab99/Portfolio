import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Mail, Send, Loader2, Github, Linkedin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm, ValidationError } from '@formspree/react';

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, handleSubmit] = useForm("mojowpdn");

  const validateField = (name: string, value: string) => {
    if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email';
    }
    if (value.trim() === '') {
      return 'This field is required';
    }
    return '';
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Hand over to Formspree
    await handleSubmit(e);
  };

  useEffect(() => {
    if (state.succeeded) {
      setShowSuccess(true);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [state.succeeded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Section Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-primary font-mono text-sm tracking-widest uppercase mb-4"
          >
            What's Next?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold font-heading"
          >
            Get In Touch
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">
          
          {/* LEFT: context + channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <p className="text-muted-foreground leading-relaxed mb-8 text-base md:text-lg">
              Open to new opportunities. Drop a message, I typically respond within 24 hours.
            </p>

            <div className="flex items-center gap-3 mb-10 text-primary font-mono text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary ring-4 ring-primary/20"></span>
              </span>
              Available for work
            </div>

            <div className="flex flex-col gap-4">
              <a href="mailto:muhammadmuttayab09@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all hover:translate-x-1 w-fit group text-sm md:text-base">
                <Mail size={18} className="group-hover:text-primary transition-colors" />
                <span>muhammadmuttayab09@gmail.com</span>
              </a>
              <a href="https://github.com/Muttayab99" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all hover:translate-x-1 w-fit group text-sm md:text-base">
                <Github size={18} className="group-hover:text-primary transition-colors" />
                <span>github.com/Muttayab99</span>
              </a>
              <a href="https://linkedin.com/in/m-muttayab" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all hover:translate-x-1 w-fit group text-sm md:text-base">
                <Linkedin size={18} className="group-hover:text-primary transition-colors" />
                <span>linkedin.com/in/m-muttayab</span>
              </a>
            </div>
          </motion.div>

          {/* RIGHT: Contact Form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 md:p-8 text-left w-full"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
                  Name
                </label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-1 transition-all ${errors.name
                      ? 'border-destructive focus:border-destructive focus:ring-destructive'
                      : 'border-border focus:border-primary focus:ring-primary focus:shadow-[0_0_0_3px_rgba(45,212,191,0.12)]'
                    }`}
                  placeholder="Your name"
                  animate={errors.name ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                  Email
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-1 transition-all ${errors.email
                      ? 'border-destructive focus:border-destructive focus:ring-destructive'
                      : 'border-border focus:border-primary focus:ring-primary focus:shadow-[0_0_0_3px_rgba(45,212,191,0.12)]'
                    }`}
                  placeholder="your@email.com"
                  animate={errors.email ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-xs mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold mb-2 text-foreground">
                Message
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                rows={5}
                className={`w-full px-4 py-3 bg-muted border rounded-lg focus:outline-none focus:ring-1 transition-all resize-none ${errors.message
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-2'
                    : 'border-border focus:border-primary focus:ring-primary focus:ring-2 focus:ring-offset-1 focus:ring-offset-background'
                  }`}
                placeholder="Your message..."
                animate={errors.message ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs mt-1"
                >
                  {errors.message}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={state.submitting}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold border-none rounded-lg px-7 py-3.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_10px_28px_rgba(255,255,255,0.2)]"
              whileTap={{ scale: state.submitting ? 1 : 0.98 }}
            >
              {state.submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </motion.button>

            {/* Success Toast Animation */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.5 }}
                className="fixed bottom-8 right-8 bg-primary text-primary-foreground px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">Message sent successfully!</span>
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

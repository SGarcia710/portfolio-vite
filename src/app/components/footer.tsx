import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Button } from './ui/button';
import logoWhite from '../../../assets/LogoSG-IconWhite.svg';
import logoBlack from '../../../assets/LogoSG-IconBlack.svg';

export function Footer({ isDark = false }: { isDark?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative py-20 bg-background-secondary border-t border-border">
      <div className="container-premium">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Let's Build Something Amazing
          </h2>
          <p className="text-lg md:text-xl text-foreground-secondary mb-8">
            I'm currently available for freelance projects and full-time opportunities.
            Let's discuss how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              leftIcon={<Mail className="w-5 h-5" />}
              onClick={() => window.location.href = 'mailto:sebas.garcia710@icloud.com'}
            >
              Get in touch
            </Button>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-border mb-12" />

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img
              src={isDark ? logoWhite : logoBlack}
              alt="SG Logo"
              className="h-10 w-auto mb-4"
            />
            <p className="text-foreground-secondary">
              Senior Mobile Engineer specializing in React Native and modern web technologies.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4 text-2xl">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <a href="#experience" className="text-foreground-secondary hover:text-foreground transition-colors">
                Work Experience
              </a>
              <a href="#projects" className="text-foreground-secondary hover:text-foreground transition-colors">
                Projects
              </a>
              <a href="#contact" className="text-foreground-secondary hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4 text-2xl">Connect</h3>
            <div className="flex gap-4">
              <SocialButton
                href="https://github.com/SGarcia710"
                icon={<Github className="w-5 h-5" />}
                label="GitHub"
              />
              <SocialButton
                href="https://www.linkedin.com/in/sebastian-garcia-ospina/"
                icon={<Linkedin className="w-5 h-5" />}
                label="LinkedIn"
              />
              <SocialButton
                href="mailto:sebas.garcia710@icloud.com"
                icon={<Mail className="w-5 h-5" />}
                label="Email"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2">
            © {currentYear} Sebastián García. Built with{' '}
            <Heart className="w-4 h-4 text-red-500 fill-current" /> using React & TypeScript
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
      aria-label={label}
    >
      {icon}
    </motion.a>
  );
}

import React from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';

export function HeroSection() {
  const revealStyle = (delay: string) => ({ '--hero-delay': delay } as React.CSSProperties);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      {/* Animated Orbs */}
      <div className="hero-orb hero-orb-primary absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      <div className="hero-orb hero-orb-secondary absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="container-premium relative z-10 hero-shell">
        <div className="max-w-5xl mx-auto text-center">
          {/* Greeting */}
          <div className="mb-6 hero-reveal" style={revealStyle('0s')}>
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20">
              Available for opportunities
            </span>
          </div>

          {/* Name & Title */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 hero-reveal"
            style={revealStyle('0.15s')}
          >
            Sebastián García
          </h1>

          <div
            className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-8 text-foreground-secondary hero-reveal"
            style={revealStyle('0.25s')}
          >
            Senior Mobile Engineer
          </div>

          {/* Value Proposition */}
          <p
            className="text-lg md:text-xl lg:text-2xl text-foreground-secondary max-w-3xl mx-auto mb-12 leading-relaxed hero-reveal"
            style={revealStyle('0.35s')}
          >
            Crafting exceptional mobile experiences with{' '}
            <span className="text-foreground font-semibold">React Native</span> and{' '}
            <span className="text-foreground font-semibold">modern technologies</span>.
            8 years of building high-performance apps that users love.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 hero-reveal"
            style={revealStyle('0.45s')}
          >
            <Button
              size="xl"
              leftIcon={<Mail className="w-5 h-5" />}
              onClick={() => {
                window.location.href = 'mailto:sebas.garcia710@icloud.com';
              }}
            >
              Get in touch
            </Button>
            <Button
              variant="secondary"
              size="xl"
              leftIcon={<Github className="w-5 h-5" />}
              onClick={() => window.open('https://github.com/SGarcia710', '_blank')}
            >
              View GitHub
            </Button>
          </div>

          {/* Social Links */}
          <div
            className="flex items-center justify-center gap-6 mb-16 hero-reveal"
            style={revealStyle('0.55s')}
          >
            <SocialLink
              href="https://github.com/SGarcia710"
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
            />
            <SocialLink
              href="https://www.linkedin.com/in/sebastian-garcia-ospina/"
              icon={<Linkedin className="w-5 h-5" />}
              label="LinkedIn"
            />
            <SocialLink
              href="mailto:sebas.garcia710@icloud.com"
              icon={<Mail className="w-5 h-5" />}
              label="Email"
            />
          </div>

          {/* Scroll Indicator */}
          <div
            className="flex flex-col items-center gap-2 hero-reveal"
            style={revealStyle('0.65s')}
          >
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <div className="hero-bounce">
              <ArrowDown className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-all duration-200 hover:-translate-y-0.5"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { 
  Instagram, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Users, 
  Target, 
  Heart, 
  ShieldCheck, 
  CreditCard,
  Menu,
  X
} from 'lucide-react';

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        ['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(target.tagName) ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    let animationFrameId: number;
    const updatePosition = () => {
      setPosition(prev => ({
        x: prev.x + (cursorRef.current.x - prev.x) * 0.15,
        y: prev.y + (cursorRef.current.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    updatePosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className={`custom-cursor hidden md:block ${isHovering ? 'hover' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

const MagneticButton = ({ children, className, priority = 'primary', onClick }: { children: React.ReactNode, className?: string, priority?: 'primary' | 'ghost', onClick?: () => void }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.35, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative px-8 py-4 font-display text-xl transition-all duration-300 transform active:scale-95 flex items-center gap-2 tracking-wide rounded-none";
  const variants = {
    primary: "bg-accent text-bg hover:opacity-90",
    ghost: "border border-border text-text hover:bg-white/5",
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseStyles} ${variants[priority]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const AnimatedNumber = ({ value, label }: { value: number | string, label: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const nodeRef = useRef(null);
  
  useEffect(() => {
    let target = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(target)) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuad = progress * (2 - progress);
          setDisplayValue(Math.floor(easeOutQuad * target));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setDisplayValue(target);
          }
        };
        requestAnimationFrame(animate);
      }
    });

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={nodeRef} className="bg-bg p-8 flex flex-col justify-center">
      <span className="text-5xl md:text-6xl font-display text-accent mb-2">
        {typeof value === 'string' && value.includes('.') ? displayValue.toFixed(1) : displayValue}
        {typeof value === 'string' && isNaN(parseFloat(value[value.length-1])) ? value[value.length-1] : ''}
      </span>
      <span className="text-[10px] font-accent text-muted uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
};

const SectionDivider = () => (
  <motion.hr 
    initial={{ width: 0 }}
    whileInView={{ width: '100%' }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: "easeInOut" }}
    className="h-[1px] border-none bg-border my-12"
  />
);

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-8 md:mb-12">
    {subtitle && <p className="text-accent font-accent text-xs md:text-sm mb-2 tracking-[0.2em]">{subtitle}</p>}
    <h2 className="text-4xl md:text-7xl font-display leading-[0.9]">{title}</h2>
  </div>
);

// --- Main App ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -300]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre', href: '#sobre' },
    { name: 'Espaço', href: '#galeria' },
    { name: 'Método', href: '#metodo' },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Contato', href: '#contato' }
  ];

  const handleWhatsApp = () => {
    window.open('https://wa.me/5519992288900', '_blank', 'noopener');
  };

  return (
    <div ref={scrollRef} className="min-h-screen selection:bg-accent selection:text-bg">
      <CustomCursor />

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'py-4 backdrop-blur-xl border-b border-border bg-bg/80' : 'py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className={`font-display text-2xl tracking-tighter transition-colors ${isScrolled ? 'text-accent' : 'text-text'}`}>
            BE FITNESS<span className="text-accent">.</span>
          </a>

          <nav className="hidden md:flex gap-10 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium hover:text-accent transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <MagneticButton className="!py-2 !px-5 !text-base" onClick={handleWhatsApp}>
              Agendar Experimental
            </MagneticButton>
          </nav>

          <button 
            className="md:hidden text-text p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-surface flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="font-display text-2xl">BE FITNESS</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 border border-border"
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-display hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="mt-auto">
              <button 
                onClick={handleWhatsApp}
                className="w-full bg-accent text-bg py-6 font-display text-2xl"
              >
                Agendar Experimental
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden py-20 md:py-0">
        {/* Parallax Background Text */}
        <motion.div 
          style={{ y: yParallax }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] whitespace-nowrap"
        >
          <span className="font-display text-[60vw] md:text-[40vw] leading-none mb-20">STUDIO</span>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <p className="font-accent text-accent text-[10px] md:text-sm mb-4 md:mb-6 tracking-[0.4em] uppercase">
            Personal Studio · Campinas · SP
          </p>

          <h1 className="flex flex-col mb-6 md:mb-8 pointer-events-none select-none">
            <span className="font-display text-[22vw] md:text-[16vw] leading-[0.75] md:leading-[0.8] text-stroke inline-block overflow-hidden">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="inline-block"
              >
                BE
              </motion.span>
            </span>
            <span className="font-display text-[22vw] md:text-[16vw] leading-[0.75] md:leading-[0.8] text-text inline-block overflow-hidden -mt-[2vw] md:-mt-[4vw]">
              <motion.span
                 initial={{ y: '100%' }}
                 animate={{ y: 0 }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                 className="inline-block"
              >
                FITNESS
              </motion.span>
            </span>
          </h1>

          <div className="max-w-xl mb-10 md:mb-12">
            <p className="text-muted text-base md:text-xl leading-relaxed">
              Aqui você tem o benefício do <span className="text-text font-medium">Personal Trainer</span> com a estrutura de uma academia completa. Ambiente focado em resultados reais e acompanhamento técnico rigoroso.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
            <MagneticButton onClick={handleWhatsApp} className="w-full sm:w-auto justify-center">
              Agendar Experimental <ArrowRight size={20} />
            </MagneticButton>
            <MagneticButton priority="ghost" onClick={() => document.getElementById('metodo')?.scrollIntoView()} className="w-full sm:w-auto justify-center">
              Conhecer o Método
            </MagneticButton>
          </div>
        </div>

        <div className="absolute bottom-8 md:bottom-12 left-6 right-6 flex items-end justify-center">
           <div className="hidden md:flex absolute left-0 bottom-0 flex-col gap-2">
             <div className="w-[1px] h-20 bg-border relative overflow-hidden">
               <motion.div 
                 animate={{ y: ['-100%', '100%'] }}
                 transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                 className="absolute inset-0 bg-accent w-full"
               />
             </div>
             <span className="font-accent text-[10px] text-muted rotate-180 [writing-mode:vertical-lr]">SCROLL</span>
           </div>

           <div className="flex flex-col items-center bg-surface px-6 py-3 md:px-8 md:py-4 border border-border scale-90 md:scale-100">
             <div className="flex gap-1 text-accent">
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
             </div>
             <p className="text-[10px] font-accent text-muted mt-2 tracking-[0.3em] uppercase whitespace-nowrap">
               5.0 — 6 avaliações Google
             </p>
           </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 max-w-7xl mx-auto px-6">
        <SectionDivider />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTitle title="UMA ACADEMIA. UMA AULA. SEU RITMO." subtitle="NOSSO CONCEITO" />
            <div className="space-y-6 text-muted text-lg leading-relaxed">
              <p>
                O <span className="text-text font-semibold">Be Fitness Personal Studio</span> não é apenas mais uma academia. É um espaço planejado para quem busca eficácia sem as distrações e lotações dos grandes centros fitness.
              </p>
              <p>
                Idealizado por <span className="text-text font-semibold">Éder Monteiro</span>, nosso método combina a intensidade do treinamento de circuito com o olhar individualizado do personal trainer. No coração de Campinas, oferecemos o que há de mais moderno em biomecânica e fisiologia do exercício para garantir que cada minuto do seu treino conte.
              </p>
            </div>
            <div className="mt-10 p-6 border-l-2 border-accent bg-accent-soft inline-block">
              <p className="text-text font-medium italic">"Qualidade supera quantidade. Aqui, cada repetição é monitorada."</p>
              <p className="font-accent text-accent text-xs mt-2 uppercase tracking-widest">— Éder Monteiro, Fundador</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/10 p-[1px]">
            <AnimatedNumber value={2} label="Professores" />
            <AnimatedNumber value={5} label="Alunos / Hora" />
            <AnimatedNumber value="60" label="Minutos Aula" />
            <AnimatedNumber value="5.0" label="Nota Google" />
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section id="diferenciais" className="py-24 bg-surface/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="A TRANSFORMAÇÃO É AGORA." subtitle="DIFERENCIAIS" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 p-[1px]">
            {[
              { 
                icon: <Zap className="text-accent" />, 
                title: "Treino em Circuito", 
                desc: "Estímulo por tempo, não por repetição. Intensidade máxima desde o primeiro dia para otimizar seus resultados." 
              },
              { 
                icon: <Users className="text-accent" />, 
                title: "Atendimento Individualizado", 
                desc: "Aula em grupo com olhar de personal. Cada movimento é visto, corrigido e adaptado às suas limitações." 
              },
              { 
                icon: <Clock className="text-accent" />, 
                title: "Horário Marcado", 
                desc: "Sem filas. Sem espera. Você chega, treina no seu horário e já sente a diferença na sua rotina diária." 
              },
              { 
                icon: <Target className="text-accent" />, 
                title: "Bioimpedância", 
                desc: "Avaliação completa todo mês. Dados reais (massa magra, gordura, hidratação) para monitorar sua evolução real." 
              },
              { 
                icon: <Heart className="text-accent" />, 
                title: "Ambiente Inclusivo", 
                desc: "Empreendimento LGBTQ+ friendly. Respeito, acolhimento e energia positiva para você se sentir em casa." 
              },
              { 
                icon: <CreditCard className="text-accent" />, 
                title: "Preço Acessível", 
                desc: "O melhor custo-benefício de Campinas. Preço de academia de rede com entrega e exclusividade de personal." 
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-8 md:p-12 bg-bg hover:bg-surface transition-all duration-500"
              >
                <div className="mb-6 md:mb-8 w-10 h-10 flex items-center justify-center text-accent/50 group-hover:text-accent transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-display mb-4 tracking-wide uppercase">{item.title}</h3>
                <p className="text-muted leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <SectionDivider />
        <SectionTitle title="ESTRUTURA DE ALTA PERFORMANCE." subtitle="NOSSO ESPAÇO" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/3] md:aspect-square overflow-hidden bg-surface group"
          >
            <img 
              src="https://i.ibb.co/yntxmmm1/befitness1.jpg" 
              alt="Equipamentos modernos Be Fitness" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="aspect-[4/3] md:aspect-square overflow-hidden bg-surface group"
          >
            <img 
              src="https://i.ibb.co/hFRRzL2H/befitness2.jpg" 
              alt="Ambiente de treino Be Fitness" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section id="metodo" className="py-24 max-w-7xl mx-auto px-6">
        <SectionDivider />
        <SectionTitle title="JORNADA PARA A SUA MELHOR VERSÃO." subtitle="COMO FUNCIONA" />
        
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { id: "01", title: "Agende sua Experimental", desc: "Entre em contato via WhatsApp e escolha o melhor horário. Sem compromisso, sem burocracia." },
            { id: "02", title: "Faça sua Avaliação", desc: "Utilizamos balança de bioimpedância profissional para definir seu ponto de partida e metas claras." },
            { id: "03", title: "Comece a Evoluir", desc: "Treino dinâmico, acompanhamento real e resultados visíveis. A constância será seu novo hábito." }
          ].map((step, i) => (
            <div key={i} className="relative pt-12">
              <span className="absolute top-0 left-0 text-[120px] font-display text-muted opacity-10 leading-none select-none">
                {step.id}
              </span>
              <div className="relative z-10">
                <h4 className="text-3xl font-display mb-4 tracking-wide uppercase">{step.title}</h4>
                <p className="text-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 bg-surface/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle title="VOZES DE QUEM VIVE A EXPERIÊNCIA." subtitle="DEPOIMENTOS" />
          
          <motion.div 
            drag="x"
            dragConstraints={{ left: -1000, right: 0 }}
            className="flex gap-8 cursor-grab active:cursor-grabbing"
          >
            {[
              {
                name: "Hellen Sizenando",
                text: "O ambiente de treino influencia diretamente no desempenho e na constância da prática esportiva. Estar em um local que transmite energia positiva, com estrutura adequada e pessoas motivadas, faz toda a diferença.",
                role: "Aluna Fiel"
              },
              {
                name: "Heloisa Alavarce",
                text: "Espaço incrível e completo. Tive uma experiência incrível com os personal trainers Éder e Michel, ambos extremamente competentes, atenciosos e dedicados. Recomendo para todos!",
                role: "Atleta"
              },
              {
                name: "Valéria Falopa",
                text: "Treinar na BE Fitness foi uma das melhores escolhas que fiz para minha saúde. O estúdio tem um ambiente extremamente organizado, confortável e seguro. Os resultados vêm naturalmente.",
                role: "Empresária"
              }
            ].map((dep, i) => (
              <div 
                key={i} 
                className="min-w-[280px] md:min-w-[450px] p-6 md:p-10 bg-surface border border-border flex flex-col gap-6 select-none"
              >
                <div className="flex gap-1 text-accent">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-base md:text-xl italic text-muted leading-relaxed">"{dep.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent text-bg font-display text-xl md:text-2xl flex items-center justify-center">
                    {dep.name[0]}
                  </div>
                  <div>
                    <h5 className="font-display text-lg md:text-xl uppercase tracking-wider">{dep.name}</h5>
                    <p className="text-[10px] font-accent text-muted uppercase tracking-widest">{dep.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          <p className="text-center text-muted font-accent text-[10px] uppercase tracking-[0.3em] mt-12 opacity-50">Arraste para navegar</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 bg-accent text-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-5xl md:text-[10vw] leading-tight md:leading-none mb-8">
            PRONTO PARA COMEÇAR?
          </h2>
          <p className="text-bg/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Agende sua aula experimental agora mesmo e sinta a diferença que um acompanhamento premium pode fazer no seu corpo e na sua mente.
          </p>
          <button 
            onClick={handleWhatsApp}
            className="group px-8 md:px-12 py-5 md:py-6 bg-bg text-text font-display text-2xl md:text-3xl hover:bg-white hover:text-bg transition-all duration-500 scale-100 hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
          >
            AGENDAR AGORA <ArrowRight size={24} className="md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
        
        {/* Decorative Graphic */}
        <div className="absolute top-0 right-0 pointer-events-none opacity-10">
           <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
             <path d="M0 400L400 0H0V400Z" fill="currentColor" />
           </svg>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="py-24 bg-bg border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="col-span-1 lg:col-span-2">
            <span className="font-display text-3xl text-text mb-6 inline-block">BE FITNESS<span className="text-accent">.</span></span>
            <p className="text-muted max-w-sm leading-relaxed mb-8">
              Personal Studio by Éder Monteiro. Elevando o padrão de treinamento físico com exclusividade e ciência esportiva em Campinas.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-border flex items-center justify-center hover:bg-accent hover:text-bg transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h6 className="font-display text-xl mb-6 uppercase tracking-wider">Localização</h6>
            <ul className="space-y-4 text-muted text-sm leading-relaxed">
              <li className="flex gap-3">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>Av. São José dos Campos, 2236<br />Vila Campos Sales, Campinas - SP</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <span>(19) 99228-8900</span>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-display text-xl mb-6 uppercase tracking-wider">Horários</h6>
            <ul className="space-y-4 text-muted text-sm">
              <li className="flex justify-between border-b border-border pb-2">
                <span>Seg – Sex</span>
                <span className="text-text">06h – 22h</span>
              </li>
              <li className="flex justify-between border-b border-border pb-2">
                <span>Sábado</span>
                <span className="text-text">08h – 13h</span>
              </li>
              <li className="flex justify-center pt-2">
                <span className="font-accent text-[10px] text-accent uppercase tracking-widest">Apenas horário marcado</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted text-[10px] font-accent uppercase tracking-widest">
            © 2025 Be Fitness Studio. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-muted text-[10px] font-accent uppercase tracking-widest">
            <a href="#" className="hover:text-accent transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-accent transition-colors">Termos de Uso</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5519992288900"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-shadow hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="0" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </div>
  );
}


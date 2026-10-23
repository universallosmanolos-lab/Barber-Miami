/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Phone,
  Scissors,
  MapPin,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
  Instagram,
  User,
  Sparkles,
  Home,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  time: string;
  badge?: string;
  description: string;
  details: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: 'corte-personalizado',
    name: 'Corte personalizado',
    price: 40,
    time: '45 min',
    badge: 'ESTILO A MEDIDA',
    description: 'Corte adaptado al estilo, fisonomía y preferencias de cada cliente.',
    details: [
      'Corte adaptado al estilo del cliente',
      'Terminación y detalles milimétricos del corte',
      'Asesoramiento morfológico previo',
      'Acabado con producto premium'
    ]
  },
  {
    id: 'corte-barba',
    name: 'Corte + barba',
    price: 50,
    time: '60 min',
    badge: 'MÁS POPULAR',
    description: 'La combinación definitiva para una imagen limpia, masculina y equilibrada.',
    details: [
      'Corte de cabello completo y personalizado',
      'Arreglo y definición de barba a navaja',
      'Perfilado limpio de líneas y contornos',
      'Aceite o bálsamo hidratante para barba'
    ]
  },
  {
    id: 'servicio-vip',
    name: 'Servicio VIP',
    price: 80,
    time: '75 min',
    badge: 'EXPERIENCIA PREMIUM',
    description: 'El ritual integral de cuidado masculino de alta gama con máxima relajación.',
    details: [
      'Corte de cabello de precisión artesanal',
      'Arreglo y perfilado completo de barba',
      'Definición y limpieza de cejas',
      'Mascarilla facial purificante y toalla tibia'
    ]
  }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Booking Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('corte-barba');
  const [modality, setModality] = useState<'local' | 'domicilio'>('local');
  const [bookingDate, setBookingDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [customNotes, setCustomNotes] = useState('');

  // Form Validation & Feedback
  const [nameError, setNameError] = useState(false);
  const [dateError, setDateError] = useState(false);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [bookingSummary, setBookingSummary] = useState({
    name: '',
    phone: '',
    serviceName: '',
    servicePrice: 0,
    modalityText: '',
    totalPrice: 0,
    date: '',
    time: '',
    notes: ''
  });

  // Business constants (Strictly matching prompt)
  const PHONE_DISPLAY = '+1 305-724-1036';
  const PHONE_TEL = 'tel:+13057241036';
  const WHATSAPP_RAW = '13057241036';
  const INSTAGRAM_URL = 'https://www.instagram.com/dmbarber__miami/';
  const GENERAL_LOCATION = 'Miami, Florida, Estados Unidos';
  const BARBER_NAME = 'Alejandro Mora DM';
  const BUSINESS_NAME = 'Barber Miami';
  const DOMICILIO_SUPPLEMENT = 20;

  // Selected Service calculation
  const currentService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[1];
  const calculatedTotal = currentService.price + (modality === 'domicilio' ? DOMICILIO_SUPPLEMENT : 0);

  // Scroll reveal effect
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 40;
        if (elementTop < windowHeight - elementVisible) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectServiceFromCard = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const element = document.getElementById('reservas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameVal = clientName.trim();
    let hasError = false;

    if (nameVal.length < 2) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!bookingDate) {
      setDateError(true);
      hasError = true;
    } else {
      setDateError(false);
    }

    if (hasError) return;

    const modalityText = modality === 'domicilio' 
      ? `A domicilio (+ $${DOMICILIO_SUPPLEMENT} suplemento)` 
      : 'En el establecimiento';

    const phoneText = clientPhone.trim() ? clientPhone.trim() : 'No especificado (contactar por este chat)';
    const notesText = customNotes.trim() ? customNotes.trim() : 'Sin comentarios adicionales';

    const message = `💈 *SOLICITUD DE CITA — ${BUSINESS_NAME.toUpperCase()}* 💈
----------------------------------
👤 *Cliente:* ${nameVal}
📞 *Teléfono:* ${phoneText}
✂️ *Servicio:* ${currentService.name} ($${currentService.price})
🚗 *Modalidad:* ${modalityText}
💵 *Total estimado:* $${calculatedTotal} USD
📅 *Fecha preferida:* ${bookingDate}
⏰ *Hora preferida:* ${preferredTime}
💬 *Comentarios:* ${notesText}
💈 *Barbero:* ${BARBER_NAME}
📍 *Zona:* ${GENERAL_LOCATION}
----------------------------------
_Aviso: Esta solicitud queda pendiente de confirmación de disponibilidad por Alejandro Mora DM. Enviado desde la web oficial de Barber Miami._`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_RAW}?text=${encoded}`;
    setWhatsappUrl(url);

    setBookingSummary({
      name: nameVal,
      phone: phoneText,
      serviceName: currentService.name,
      servicePrice: currentService.price,
      modalityText: modalityText,
      totalPrice: calculatedTotal,
      date: bookingDate,
      time: preferredTime,
      notes: notesText
    });

    setBookingModalOpen(true);
  };

  const handleCopyLink = () => {
    if (whatsappUrl) {
      navigator.clipboard.writeText(whatsappUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="bg-[#0B0C0E] text-neutral-300 font-sans antialiased selection:bg-[#D4AF37] selection:text-black min-h-screen">
      {/* Styles for gold stroke and reveal */}
      <style>{`
        .text-outline-gold {
          -webkit-text-stroke: 1.5px #D4AF37;
          color: transparent;
        }
        .text-gold-gradient {
          background: linear-gradient(135deg, #FFF3BF 0%, #D4AF37 50%, #AA820A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8);
          cursor: pointer;
        }
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* ========================================================= */}
      {/* 1. HEADER & NAVEGACIÓN                                    */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#0B0C0E]/95 backdrop-blur-md border-b border-[#20232A] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3.5 group" aria-label="Barber Miami Inicio">
            <div className="w-11 h-11 bg-gradient-to-br from-[#E5C05B] via-[#D4AF37] to-[#997300] text-black flex items-center justify-center font-heading text-xl font-extrabold tracking-tighter group-hover:scale-105 transition-transform duration-300 shadow-[0_0_18px_rgba(212,175,55,0.3)]">
              BM
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl tracking-widest text-white group-hover:text-[#D4AF37] transition-colors duration-300 leading-none" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                BARBER MIAMI
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-0.5">
                ALEJANDRO MORA DM
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase">
            <a href="#servicios" className="hover:text-[#D4AF37] transition-colors duration-200">Servicios</a>
            <a href="#barbero" className="hover:text-[#D4AF37] transition-colors duration-200">El Barbero</a>
            <a href="#reservas" className="hover:text-[#D4AF37] transition-colors duration-200">Reservar Cita</a>
            <a href="#contacto" className="hover:text-[#D4AF37] transition-colors duration-200">Contacto</a>
          </nav>

          {/* Action Header Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white border border-[#20232A] hover:border-[#D4AF37]/60 transition-all bg-[#121316]"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Llamar</span>
            </a>
            <a
              href="#reservas"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#E5C05B] to-[#D4AF37] hover:brightness-110 transition-all shadow-[0_0_16px_rgba(212,175,55,0.25)] active:scale-95"
            >
              <span>RESERVAR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
            className="md:hidden text-white hover:text-[#D4AF37] p-2 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121316] border-b border-[#20232A] px-6 py-6 flex flex-col gap-4 text-center">
            <a
              href="#servicios"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest py-2 text-neutral-200 hover:text-[#D4AF37]"
            >
              Servicios & Precios
            </a>
            <a
              href="#barbero"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest py-2 text-neutral-200 hover:text-[#D4AF37]"
            >
              Sobre Alejandro Mora DM
            </a>
            <a
              href="#reservas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest py-2 text-neutral-200 hover:text-[#D4AF37]"
            >
              Reservar por WhatsApp
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-widest py-2 text-neutral-200 hover:text-[#D4AF37]"
            >
              Contacto
            </a>

            <div className="pt-3 border-t border-[#20232A] flex flex-col gap-2.5">
              <a
                href={PHONE_TEL}
                className="w-full py-3 bg-[#181A1F] border border-[#20232A] text-white font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>Llamar {PHONE_DISPLAY}</span>
              </a>
              <a
                href="#reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest"
              >
                SOLICITAR CITA
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden border-b border-[#20232A]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 z-10 space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-[#D4AF37]/30 bg-[#121316]/90 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              ALEJANDRO MORA DM · MIAMI, FLORIDA
            </div>

            {/* Main Title strictly as requested */}
            <h1 className="font-heading text-5xl sm:text-7xl xl:text-8xl leading-[0.92] tracking-tight text-white uppercase" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              TU ESTILO. <br />
              <span className="text-outline-gold">TU IMAGEN.</span> <br />
              TU BARBERÍA.
            </h1>

            {/* Subtitle strictly as requested */}
            <p className="text-neutral-300 text-sm sm:text-base max-w-xl font-light leading-relaxed">
              Cortes personalizados, cuidado de barba y atención a domicilio en Miami. Dale a tu imagen el cuidado que merece.
            </p>

            {/* Value chips */}
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121316] border border-[#20232A] text-xs text-neutral-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> +8 Años de Experiencia
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121316] border border-[#20232A] text-xs text-neutral-300 font-medium">
                <Home className="w-3.5 h-3.5 text-[#D4AF37]" /> Servicio a Domicilio (+$20)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121316] border border-[#20232A] text-xs text-neutral-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Miami, FL
              </span>
            </div>

            {/* Buttons: Reservar por WhatsApp & Llamar ahora */}
            <div className="pt-4 flex flex-col sm:flex-row flex-wrap gap-4">
              <a
                href="#reservas"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#E5C05B] to-[#D4AF37] hover:brightness-110 text-black font-bold uppercase text-xs tracking-widest transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/25 min-h-[48px] active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-black/20" />
                <span>RESERVAR POR WHATSAPP</span>
              </a>

              <a
                href={PHONE_TEL}
                aria-label={`Llamar directamente a Barber Miami al ${PHONE_DISPLAY}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-[#D4AF37]/70 hover:border-[#D4AF37] bg-[#121316] hover:bg-[#181A1F] text-[#D4AF37] hover:text-white font-bold uppercase text-xs tracking-widest transition-all duration-300 min-h-[48px] active:scale-95"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>LLAMAR AHORA</span>
              </a>

              <a
                href="#servicios"
                className="inline-flex items-center justify-center px-6 py-4 border border-[#20232A] hover:border-[#D4AF37]/50 bg-[#121316]/60 text-neutral-300 hover:text-white font-medium uppercase text-xs tracking-widest transition-all min-h-[48px]"
              >
                VER PRECIOS
              </a>
            </div>

            <p className="text-[11px] text-neutral-400 font-light flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Atención profesional con agenda personalizada sin esperas innecesarias.
            </p>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative frame */}
              <div className="absolute -inset-2 border border-[#D4AF37]/30 translate-x-3 translate-y-3 pointer-events-none hidden sm:block"></div>

              <div className="relative overflow-hidden bg-[#121316] shadow-2xl border border-[#20232A]">
                <img
                  src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop"
                  alt="Barbero realizando corte degradado y perfilado profesional para Barber Miami"
                  width="800"
                  height="960"
                  className="w-full h-[500px] object-cover filter contrast-110 grayscale-[25%] hover:grayscale-0 transition-all duration-700 ease-in-out"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-transparent opacity-90"></div>

                {/* Floating card info */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#121316]/95 backdrop-blur-md border border-[#20232A] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-widest">Barbero Titular</p>
                    <p className="font-heading text-xl text-white tracking-wide" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                      ALEJANDRO MORA DM
                    </p>
                    <p className="text-[11px] text-neutral-400">Miami, Florida · +8 años de experiencia</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#181A1F] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <Scissors className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SECCIÓN SERVICIOS Y PRECIOS                            */}
      {/* ========================================================= */}
      <section id="servicios" className="py-24 border-b border-[#20232A] relative bg-[#0E0F12]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-16 reveal">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
              Carta Oficial de Servicios
            </span>
            <h2 className="font-heading text-5xl sm:text-6xl text-white uppercase tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              SERVICIOS & PRECIOS
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mt-3"></div>
            <p className="text-neutral-300 text-sm mt-4 font-light leading-relaxed">
              Tarifas claras, oficio riguroso y dedicación exclusiva a tu imagen. Selecciona tu servicio para solicitar cita directa con Alejandro Mora DM.
            </p>
          </div>

          {/* Service Cards Grid (Services 1, 2, 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const isSelected = selectedServiceId === service.id;
              const isHighlighted = service.id === 'corte-barba';

              return (
                <div
                  key={service.id}
                  className={`reveal group relative bg-[#121316] border transition-all duration-300 p-8 flex flex-col justify-between hover:-translate-y-2 ${
                    isHighlighted
                      ? 'border-[#D4AF37] shadow-[0_12px_35px_rgba(212,175,55,0.12)]'
                      : 'border-[#20232A] hover:border-[#D4AF37]/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {service.badge && (
                    <div className="absolute -top-3.5 right-6 bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 shadow-sm">
                      {service.badge}
                    </div>
                  )}

                  <div>
                    {/* Header price */}
                    <div className="flex items-baseline justify-between mb-6">
                      <span className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                        {service.time}
                      </span>
                      <div className="text-right">
                        <span className="font-heading text-4xl sm:text-5xl text-white group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                          ${service.price}
                        </span>
                        <span className="text-xs text-neutral-400 block -mt-1">USD</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-3xl text-white tracking-wide uppercase mb-3" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                      {service.name}
                    </h3>

                    <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Bullet details */}
                    <ul className="space-y-2.5 pt-4 border-t border-[#20232A]">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="mt-8 pt-6 border-t border-[#20232A]">
                    <button
                      onClick={() => handleSelectServiceFromCard(service.id)}
                      type="button"
                      className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        isSelected || isHighlighted
                          ? 'bg-[#D4AF37] hover:bg-[#E5C05B] text-black shadow-md'
                          : 'bg-[#181A1F] hover:bg-[#D4AF37] text-white hover:text-black border border-[#20232A]'
                      }`}
                    >
                      <span>SOLICITAR ESTE CORTE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Service 4: Servicio a Domicilio (Clear explanation of $20 supplement) */}
          <div className="mt-10 bg-[#121316] border border-[#D4AF37]/40 p-8 sm:p-10 reveal shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  <Home className="w-4 h-4 text-[#D4AF37]" />
                  MODALIDAD PREMIUM EN MIAMI
                </div>
                
                <h3 className="font-heading text-3xl sm:text-4xl text-white uppercase tracking-wide" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  SERVICIO A DOMICILIO — SUPLEMENTO DE $20
                </h3>

                <p className="text-neutral-300 text-sm leading-relaxed font-light">
                  Alejandro Mora DM se traslada directamente a tu residencia, hotel o lugar de conveniencia en Miami. 
                  Se aplica un <strong className="text-white font-semibold">suplemento fijo de $20</strong> sobre el servicio elegido (Corte personalizado, Corte + barba o Servicio VIP). El precio final dependerá del servicio seleccionado.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Equipamiento profesional completo transportable
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Máxima comodidad y privacidad
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-center gap-3">
                <div className="p-4 bg-[#0B0C0E] border border-[#20232A] text-center">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Tarifa adicional</span>
                  <span className="font-heading text-4xl text-[#D4AF37]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>+$20 USD</span>
                  <span className="text-[10px] text-neutral-400 block">+ costo del servicio elegido</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setModality('domicilio');
                    const element = document.getElementById('reservas');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-bold uppercase text-xs tracking-widest text-center transition-all shadow-md"
                >
                  RESERVAR A DOMICILIO
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SOBRE EL BARBERO (ALEJANDRO MORA DM)                   */}
      {/* ========================================================= */}
      <section id="barbero" className="py-24 border-b border-[#20232A] relative bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Barber Image showcase */}
            <div className="lg:col-span-5 reveal">
              <div className="relative">
                <div className="absolute -inset-2 border border-[#D4AF37]/25 -translate-x-3 -translate-y-3 pointer-events-none hidden sm:block"></div>
                
                <div className="relative overflow-hidden bg-[#121316] border border-[#20232A] shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop"
                    alt="Barbero Alejandro Mora DM en Barber Miami atendiendo con precisión"
                    className="w-full h-[480px] object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-transparent opacity-85"></div>

                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#121316]/90 backdrop-blur-md border border-[#20232A]">
                    <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-widest">Profesional al mando</span>
                    <p className="font-heading text-2xl text-white" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                      ALEJANDRO MORA DM
                    </p>
                    <p className="text-xs text-neutral-400">Barbero Profesional · Miami, FL</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barber Description */}
            <div className="lg:col-span-7 space-y-6 reveal">
              <div>
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
                  Oficio, Dedicación y Técnica
                </span>
                <h2 className="font-heading text-5xl sm:text-6xl text-white uppercase tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  CONOCE A TU BARBERO
                </h2>
                <div className="w-16 h-1 bg-[#D4AF37] mt-3"></div>
              </div>

              {/* Exact text provided in prompt */}
              <div className="p-6 bg-[#121316] border-l-4 border-l-[#D4AF37] border-y border-r border-[#20232A]">
                <p className="text-neutral-200 text-base sm:text-lg leading-relaxed font-light italic">
                  “Alejandro Mora DM es un barbero con más de ocho años de experiencia, enfocado en los detalles, los cortes personalizados y el cuidado de la imagen. Su objetivo es ofrecer una atención profesional y un estilo adaptado a cada cliente.”
                </p>
              </div>

              {/* Verified pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#121316] border border-[#20232A]">
                  <span className="font-heading text-3xl text-[#D4AF37]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>+8 AÑOS</span>
                  <p className="text-xs text-neutral-300 font-medium uppercase tracking-wider mt-1">Experiencia</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Dedicación continua al arte de la barbería.</p>
                </div>

                <div className="p-4 bg-[#121316] border border-[#20232A]">
                  <span className="font-heading text-3xl text-[#D4AF37]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>100%</span>
                  <p className="text-xs text-neutral-300 font-medium uppercase tracking-wider mt-1">Personalizado</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Cortes adaptados a tus rasgos y estilo de vida.</p>
                </div>

                <div className="p-4 bg-[#121316] border border-[#20232A]">
                  <span className="font-heading text-3xl text-[#D4AF37]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>MIAMI</span>
                  <p className="text-xs text-neutral-300 font-medium uppercase tracking-wider mt-1">Ubicación</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Atención local y servicio a domicilio en la zona.</p>
                </div>
              </div>

              {/* Social and contact tags */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@dmbarber__miami</span>
                </a>

                <span className="text-neutral-500">·</span>

                <span className="text-xs text-neutral-400">
                  Perfil relacionado: <span className="text-neutral-300 font-medium">@the_dm420</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. RESERVAS POR WHATSAPP (FORMULARIO FUNCIONAL)           */}
      {/* ========================================================= */}
      <section id="reservas" className="py-24 relative overflow-hidden bg-[#0E0F12]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left information column */}
            <div className="lg:col-span-5 space-y-6 reveal">
              <div>
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
                  Gestión Ágil y Directa
                </span>
                <h2 className="font-heading text-5xl sm:text-6xl text-white uppercase tracking-tight leading-none" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  SOLICITA TU CITA
                </h2>
                <div className="w-16 h-1 bg-[#D4AF37] mt-3"></div>
              </div>

              <p className="text-neutral-300 text-sm leading-relaxed font-light">
                Completa tus datos y selecciona la modalidad. Al presionar el botón se generará tu mensaje con el formato oficial para enviarlo directamente al WhatsApp de Alejandro Mora DM.
              </p>

              {/* Notice that reservations require barber confirmation */}
              <div className="p-4 bg-[#121316] border border-[#D4AF37]/30 text-xs text-neutral-300 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CONFIRMACIÓN PERSONALIZADA</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  Las solicitudes se coordinan directamente entre el cliente y el barbero. La reserva quedará confirmada una vez que Alejandro valide el horario contigo en WhatsApp.
                </p>
              </div>

              {/* Quick direct contact info card */}
              <div className="p-6 bg-[#121316] border border-[#20232A] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold">Llamadas & WhatsApp</p>
                    <a href={PHONE_TEL} className="font-heading text-2xl text-white hover:text-[#D4AF37] transition-colors" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-[#20232A]">
                  <div className="w-11 h-11 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold">Zona de Cobertura</p>
                    <p className="text-sm font-medium text-neutral-200">
                      {GENERAL_LOCATION}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-[#20232A]">
                  <div className="w-11 h-11 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold">Barbero Asignado</p>
                    <p className="text-sm font-medium text-neutral-200">
                      {BARBER_NAME} (+8 años de experiencia)
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right form column */}
            <div className="lg:col-span-7 reveal">
              <div className="bg-[#121316] border border-[#20232A] p-8 sm:p-10 relative shadow-2xl">
                
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#20232A]">
                  <h3 className="font-heading text-3xl text-white uppercase tracking-wide" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                    FORMULARIO DE SOLICITUD
                  </h3>
                  <span className="text-[11px] text-[#D4AF37] font-semibold tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                    WHATSAPP DIRECTO
                  </span>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-5" noValidate>
                  
                  {/* Name (Mandatory) & Phone (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-neutral-300 mb-2 tracking-wider">
                        Nombre Completo <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Carlos Martínez"
                        required
                        className="w-full bg-[#181A1F] border border-[#20232A] px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-neutral-500"
                      />
                      {nameError && (
                        <p className="text-xs text-red-400 mt-1">Por favor escribe tu nombre para la reserva.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-neutral-300 mb-2 tracking-wider">
                        Teléfono / WhatsApp <span className="text-neutral-500 text-[10px] font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+1 (305) 000-0000"
                        className="w-full bg-[#181A1F] border border-[#20232A] px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-neutral-500"
                      />
                    </div>
                  </div>

                  {/* Servicio deseado */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-neutral-300 mb-2 tracking-wider">
                      Servicio Deseado <span className="text-[#D4AF37]">*</span>
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full bg-[#181A1F] border border-[#20232A] px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    >
                      <option value="corte-personalizado">1. Corte personalizado — $40 USD</option>
                      <option value="corte-barba">2. Corte + barba — $50 USD (Más solicitado)</option>
                      <option value="servicio-vip">3. Servicio VIP (Corte, Barba, Cejas, Mascarilla) — $80 USD</option>
                    </select>
                  </div>

                  {/* Modalidad: Establecimiento vs Domicilio */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-neutral-300 mb-2 tracking-wider">
                      Modalidad de Atención <span className="text-[#D4AF37]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setModality('local')}
                        className={`p-3.5 text-left border flex items-center justify-between transition-all ${
                          modality === 'local'
                            ? 'bg-[#181A1F] border-[#D4AF37] text-white shadow-sm'
                            : 'bg-[#181A1F]/50 border-[#20232A] text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Scissors className="w-4 h-4 text-[#D4AF37]" />
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider block">En Establecimiento</span>
                            <span className="text-[11px] text-neutral-400">Tarifa regular del corte</span>
                          </div>
                        </div>
                        {modality === 'local' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setModality('domicilio')}
                        className={`p-3.5 text-left border flex items-center justify-between transition-all ${
                          modality === 'domicilio'
                            ? 'bg-[#181A1F] border-[#D4AF37] text-white shadow-sm'
                            : 'bg-[#181A1F]/50 border-[#20232A] text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Home className="w-4 h-4 text-[#D4AF37]" />
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider block">A Domicilio</span>
                            <span className="text-[11px] text-[#D4AF37]">+$20 suplemento</span>
                          </div>
                        </div>
                        {modality === 'domicilio' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                      </button>
                    </div>
                  </div>

                  {/* Estimated Price summary bar */}
                  <div className="p-3 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-between text-xs">
                    <span className="text-neutral-400">
                      Servicio ({currentService.name}): <strong className="text-neutral-200">${currentService.price}</strong>
                      {modality === 'domicilio' && <span> + Domicilio: <strong className="text-[#D4AF37]">${DOMICILIO_SUPPLEMENT}</strong></span>}
                    </span>
                    <span className="font-heading text-xl text-[#D4AF37]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                      TOTAL ESTIMADO: ${calculatedTotal} USD
                    </span>
                  </div>

                  {/* Fecha preferida & Hora preferida */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-neutral-300 mb-2 tracking-wider">
                        Fecha Preferida <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        className="w-full bg-[#181A1F] border border-[#20232A] px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                      {dateError && (
                        <p className="text-xs text-red-400 mt-1">Selecciona una fecha válida.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-neutral-300 mb-2 tracking-wider">
                        Hora Preferida <span className="text-neutral-500 text-[10px] font-normal">(Orientativa)</span>
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-[#181A1F] border border-[#20232A] px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      >
                        <option value="10:00 AM">10:00 AM (Mañana)</option>
                        <option value="11:30 AM">11:30 AM (Mañana)</option>
                        <option value="01:00 PM">01:00 PM (Mediodía)</option>
                        <option value="02:30 PM">02:30 PM (Tarde)</option>
                        <option value="04:00 PM">04:00 PM (Tarde)</option>
                        <option value="05:30 PM">05:30 PM (Tarde)</option>
                        <option value="07:00 PM">07:00 PM (Tarde/Noche)</option>
                        <option value="Horario flexible">Horario flexible a convenir</option>
                      </select>
                    </div>
                  </div>

                  {/* Comentarios adicionales (Opcional) */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-neutral-300 mb-2 tracking-wider">
                      Comentarios Adicionales <span className="text-neutral-500 text-[10px] font-normal">(Opcional)</span>
                    </label>
                    <textarea
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      rows={2}
                      placeholder={modality === 'domicilio' ? 'Indica tu zona aproximada en Miami o detalles del estilo que buscas...' : '¿Algún requerimiento especial sobre tu corte o barba?'}
                      className="w-full bg-[#181A1F] border border-[#20232A] px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-neutral-500 resize-none"
                    />
                  </div>

                  {/* Submit Button strictly creating WhatsApp redirection */}
                  <button
                    type="submit"
                    className="w-full mt-2 py-4 bg-gradient-to-r from-[#E5C05B] to-[#D4AF37] hover:brightness-110 text-black font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-[#D4AF37]/25 active:scale-[0.99] min-h-[48px]"
                  >
                    <MessageSquare className="w-4 h-4 fill-black/20" />
                    <span>SOLICITAR CITA POR WHATSAPP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center font-light pt-1">
                    Al presionar el botón se abrirá WhatsApp con el mensaje listo para enviar al barbero.
                  </p>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SECCIÓN DE CONTACTO                                    */}
      {/* ========================================================= */}
      <section id="contacto" className="py-24 border-t border-[#20232A] relative bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-2xl mb-16 reveal">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
              Canales Oficiales
            </span>
            <h2 className="font-heading text-5xl sm:text-6xl text-white uppercase tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              CONTACTO DIRECTO
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mt-3"></div>
            <p className="text-neutral-300 text-sm mt-4 font-light leading-relaxed">
              Comunícate directamente con Alejandro Mora DM para consultas, disponibilidad o citas especiales en Miami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta WhatsApp */}
            <div className="p-8 bg-[#121316] border border-[#20232A] hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-center text-[#D4AF37] mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl text-white uppercase mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  WHATSAPP DIRECTO
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Envía un mensaje predeterminado para consultar disponibilidad o realizar reservas instantáneas.
                </p>
                <p className="text-lg font-bold text-white mb-6">
                  {PHONE_DISPLAY}
                </p>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent('Hola Alejandro, quisiera consultar sobre tus servicios en Barber Miami.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C05B] text-black font-bold uppercase text-xs tracking-widest text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>CHATEAR EN WHATSAPP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Tarjeta Llamada Telefónica */}
            <div className="p-8 bg-[#121316] border border-[#20232A] hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-center text-[#D4AF37] mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl text-white uppercase mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  LLAMADA TELEFÓNICA
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Llama directamente para atención telefónica inmediata o consultas rápidas de disponibilidad.
                </p>
                <p className="text-lg font-bold text-white mb-6">
                  {PHONE_DISPLAY}
                </p>
              </div>

              <a
                href={PHONE_TEL}
                className="w-full py-3 border border-[#D4AF37] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-bold uppercase text-xs tracking-widest text-center transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>LLAMAR AHORA</span>
              </a>
            </div>

            {/* Tarjeta Instagram & Redes */}
            <div className="p-8 bg-[#121316] border border-[#20232A] hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-center text-[#D4AF37] mb-6">
                  <Instagram className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl text-white uppercase mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                  INSTAGRAM OFICIAL
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Sigue los cortes recientes, historias diarias y el estilo de Barber Miami en redes sociales.
                </p>
                <div className="mb-6 space-y-1">
                  <p className="text-sm font-semibold text-white">@dmbarber__miami</p>
                  <p className="text-xs text-neutral-400">Perfil relacionado: @the_dm420</p>
                </div>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#181A1F] hover:bg-[#20232A] text-white font-bold uppercase text-xs tracking-widest text-center border border-[#20232A] transition-colors flex items-center justify-center gap-2"
              >
                <span>VER INSTAGRAM</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
            </div>

          </div>

          {/* Location note without fake street */}
          <div className="mt-12 p-6 bg-[#121316] border border-[#20232A] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0B0C0E] border border-[#20232A] flex items-center justify-center text-[#D4AF37] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white uppercase tracking-wider">Ubicación General</p>
                <p className="text-sm text-neutral-300">{GENERAL_LOCATION}</p>
              </div>
            </div>
            <div className="text-xs text-neutral-400 text-center sm:text-right">
              <span>Atención en establecimiento y servicio a domicilio previa coordinación.</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FOOTER                                                 */}
      {/* ========================================================= */}
      <footer className="border-t border-[#20232A] bg-[#07080A] py-12 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#D4AF37] text-black font-extrabold flex items-center justify-center text-[10px]">
                BM
              </div>
              <span className="font-heading text-xl text-white tracking-widest" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                {BUSINESS_NAME}
              </span>
            </div>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="text-neutral-400 font-light">Alejandro Mora DM · Miami, Florida</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 uppercase tracking-widest text-[11px]">
            <a href={PHONE_TEL} className="hover:text-[#D4AF37] transition-colors">{PHONE_DISPLAY}</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">Instagram</a>
            <button
              onClick={() => setPrivacyModalOpen(true)}
              type="button"
              className="hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline focus:outline-none"
            >
              Aviso de Información & Privacidad
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-[#181A1F] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Barber Miami. Todos los derechos reservados.</p>
          <p className="text-neutral-500">Tu estilo. Tu imagen. Tu barbería.</p>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 8. FLOATING ACTION PILL (MOBILE ONLY)                     */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center gap-2 bg-[#121316]/95 backdrop-blur-md p-2 border border-[#D4AF37]/40 shadow-2xl">
        <a
          href={PHONE_TEL}
          className="flex-1 py-3 bg-[#181A1F] border border-[#20232A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Llamar</span>
        </a>
        <a
          href="#reservas"
          className="flex-1 py-3 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Reservar</span>
        </a>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CONFIRMACIÓN Y DESPACHO DE WHATSAPP              */}
      {/* ========================================================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
          <div className="bg-[#121316] border border-[#D4AF37]/50 max-w-lg w-full p-8 text-center shadow-2xl relative">
            
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center rounded-full mb-4">
              <MessageSquare className="w-7 h-7" />
            </div>

            <h4 className="font-heading text-3xl text-white uppercase tracking-wider mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              ¡SOLICITUD LISTA PARA ENVIAR!
            </h4>
            
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4 font-light">
              Hemos preparado el mensaje detallado con los datos de tu cita. 
              <strong className="text-white block mt-1">
                IMPORTANTE: Al abrir WhatsApp, debes pulsar "Enviar" para que Alejandro Mora DM reciba tu solicitud.
              </strong>
            </p>

            {/* Summary card */}
            <div className="text-left bg-[#0B0C0E] border border-[#20232A] p-4 mb-6 text-xs text-neutral-300 space-y-1.5">
              <div className="flex justify-between border-b border-[#20232A] pb-1.5">
                <span className="text-neutral-400">Cliente:</span>
                <strong className="text-white">{bookingSummary.name}</strong>
              </div>
              <div className="flex justify-between border-b border-[#20232A] pb-1.5">
                <span className="text-neutral-400">Servicio:</span>
                <strong className="text-white">{bookingSummary.serviceName}</strong>
              </div>
              <div className="flex justify-between border-b border-[#20232A] pb-1.5">
                <span className="text-neutral-400">Modalidad:</span>
                <span className="text-[#D4AF37] font-semibold">{bookingSummary.modalityText}</span>
              </div>
              <div className="flex justify-between border-b border-[#20232A] pb-1.5">
                <span className="text-neutral-400">Total Estimado:</span>
                <strong className="text-[#D4AF37] text-sm">${bookingSummary.totalPrice} USD</strong>
              </div>
              <div className="flex justify-between border-b border-[#20232A] pb-1.5">
                <span className="text-neutral-400">Fecha y Hora:</span>
                <span className="text-neutral-200">{bookingSummary.date} · {bookingSummary.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Barbero:</span>
                <span className="text-neutral-200">{BARBER_NAME}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-[#E5C05B] to-[#D4AF37] hover:brightness-110 text-black font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>ABRIR WHATSAPP Y ENVIAR MENSAJE</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 border border-[#20232A] hover:border-neutral-500 text-neutral-300 hover:text-white uppercase text-[11px] tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  <span>{copiedLink ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
                </button>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  type="button"
                  className="py-2.5 border border-[#20232A] hover:border-neutral-500 text-neutral-400 hover:text-white uppercase text-[11px] tracking-wider transition-colors"
                >
                  Modificar datos
                </button>
              </div>
            </div>

            <p className="text-[10px] text-neutral-500 mt-4 leading-normal">
              * La cita no se considerará confirmada hasta que el barbero responda en WhatsApp aceptando el horario propuesto.
            </p>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: AVISO DE INFORMACIÓN & PRIVACIDAD                */}
      {/* ========================================================= */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
          <div className="bg-[#121316] border border-[#20232A] max-w-lg w-full p-8 text-left shadow-2xl max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#20232A] mb-4">
              <h4 className="font-heading text-2xl text-white uppercase tracking-wider" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                Aviso de Información & Privacidad
              </h4>
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300 space-y-3 leading-relaxed">
              <p>
                <strong>1. Identidad comercial:</strong> Esta página web es una presentación y portal de contacto para los servicios profesionales de barbería ofrecidos por <strong>Alejandro Mora DM</strong> bajo el nombre comercial <strong>Barber Miami</strong> en Miami, Florida.
              </p>
              <p>
                <strong>2. Tratamiento directo por WhatsApp:</strong> Este sitio web no almacena números de tarjeta de crédito, cuentas de usuario ni datos confidenciales en bases de datos externas. El formulario de reserva simplemente estructura un mensaje que es despachado directamente al WhatsApp de Alejandro (+1 305-724-1036) a través del protocolo oficial de WhatsApp.
              </p>
              <p>
                <strong>3. Estado de las citas:</strong> Las solicitudes realizadas no constituyen reservas automáticas ni garantizan disponibilidad instantánea. Toda fecha y hora requiere confirmación explícita por parte de Alejandro Mora DM mediante conversación directa.
              </p>
              <p>
                <strong>4. Transparencia de tarifas:</strong> Los precios publicados ($40 Corte personalizado, $50 Corte + barba, $80 Servicio VIP, y suplemento de $20 para servicio a domicilio) reflejan las tarifas vigentes comunicadas por el profesional y están sujetos a confirmación al coordinar la cita.
              </p>
              <p>
                <strong>5. Contacto:</strong> Para cualquier consulta, puedes comunicarte por WhatsApp o llamada al teléfono oficial: <strong>+1 (305) 724-1036</strong> o visitar el perfil de Instagram <strong>@dmbarber__miami</strong>.
              </p>
            </div>

            <button
              onClick={() => setPrivacyModalOpen(false)}
              type="button"
              className="mt-6 w-full py-3 bg-[#D4AF37] text-black font-bold uppercase text-xs tracking-widest hover:bg-[#E5C05B] transition-colors"
            >
              Entendido y Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

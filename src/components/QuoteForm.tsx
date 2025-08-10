// src/components/QuoteForm.tsx
import React, { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { sendMail } from '@/services/firebaseMail';

type QuoteFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  appointment?: string; // YYYY-MM-DDTHH:mm
};

const QuoteForm: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    appointment: '',
  });
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ref, isVisible] = useScrollAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprAccepted) { alert("Veuillez accepter la politique de confidentialité."); return; }
    setIsSubmitting(true);
    try {
      await sendMail({
        type: "devis",
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: "Demande de devis",
        page: "pricing",
        source: "site",
        appointment: formData.appointment || undefined,
      });
      alert("Demande envoyée avec succès.");
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', appointment: '' });
      setGdprAccepted(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de l’envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="Devis" ref={ref} className={`bg-white mt-16 p-8 md:p-10 rounded-2xl shadow-xl transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="text-center mb-10">
        <h3 className="text-3xl font-extrabold text-blue-deep">Étape 2 — Demande de devis</h3>
        <p className="mt-3 text-slate-600">Complétez le formulaire ci-dessous. Je reviens vers vous rapidement.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <label className="block">
          <span className="block mb-1 text-slate-700">Prénom</span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="ex: Jean"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-vif focus:border-transparent transition"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-slate-700">Nom</span>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="ex: Dupont"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-vif focus:border-transparent transition"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-slate-700">E-mail</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="ex: jean.dupont@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-vif focus:border-transparent transition"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-slate-700">Téléphone</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="ex: 0470 94 15 88"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-vif focus:border-transparent transition"
          />
        </label>

        <label className="block md:col-span-1">
          <span className="block mb-1 text-slate-700">Jour et heure souhaités</span>
          <input
            type="datetime-local"
            name="appointment"
            value={formData.appointment}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-vif focus:border-transparent transition"
          />
          <p className="text-xs text-slate-500 mt-1">
            À titre informatif : cette date/heure n’est pas garantie. La disponibilité sera confirmée par l’expert.
          </p>
        </label>

        <label className="block md:col-span-1">
          <span className="block mb-1 text-slate-700">Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            placeholder="Décrivez brièvement votre demande"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-vif focus:border-transparent transition"
          />
        </label>

        <div className="md:col-span-2 flex items-start">
          <input
            type="checkbox"
            id="gdpr2"
            checked={gdprAccepted}
            onChange={() => setGdprAccepted(!gdprAccepted)}
            className="h-5 w-5 mt-1 text-orange-vif border-gray-300 rounded focus:ring-orange-vif"
          />
          <label htmlFor="gdpr2" className="ml-3 text-sm text-slate-600">
            En soumettant ce formulaire, j'accepte que les informations saisies soient utilisées dans le cadre de ma demande et de la relation commerciale qui peut en découler.
          </label>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-orange-vif text-white font-bold rounded-full text-lg hover:bg-orange-vif-dark transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default QuoteForm;

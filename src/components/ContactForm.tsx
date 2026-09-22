"use client";

import { useState } from "react";

// ------------------------------------------------------------
// Clé d'accès Web3Forms — publique par conception : elle
// identifie le formulaire (et permet le filtrage/désactivation
// depuis le tableau de bord) mais ne donne aucun accès à la
// boîte mail. Web3Forms est nécessaire car l'export statique
// (hébergement mutualisé LWS) n'exécute aucun backend.
// ------------------------------------------------------------
const WEB3FORMS_ACCESS_KEY = "735f0dfc-f482-421e-9d6d-45df31c28056";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "submitting" | "success" | "error";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setError(null);

    const subject = String(data.get("subject") ?? "");
    const name = String(data.get("name") ?? "");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          // Objet de l'e-mail reçu
          subject: `[${subject}] Nouveau message via le site — ${name}`,
          // Expéditeur affiché + réponse directe au visiteur
          from_name: "Site SISBM CORE",
          replyto: data.get("email"),
          // Contenu de l'e-mail (libellés lisibles côté réception)
          Nom: data.get("name"),
          "E-mail": data.get("email"),
          Entreprise: data.get("company") || "—",
          Sujet: subject,
          Message: data.get("message"),
          // Piège anti-spam Web3Forms : champ invisible, doit rester vide
          botcheck: data.get("botcheck"),
        }),
      });

      const payload = (await response.json()) as Web3FormsResponse;

      if (response.ok && payload.success) {
        setStatus("success");
        form.reset();
      } else {
        setError(
          payload.message ??
            "Une erreur est survenue. Réessayez dans quelques instants."
        );
        setStatus("error");
      }
    } catch {
      setError(
        "Impossible d'envoyer le message. Vérifiez votre connexion et réessayez."
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 p-8 text-center">
        <span className="text-4xl" aria-hidden>
          ✅
        </span>
        <h2 className="mt-4 text-lg font-semibold text-emerald-900 dark:text-emerald-200">
          Message envoyé !
        </h2>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
          Merci pour votre message. Nous vous répondrons dans les plus brefs
          délais.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setError(null);
          }}
          className="mt-6 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      {/* Honeypot anti-spam Web3Forms : invisible pour l'utilisateur, attirant pour les bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="botcheck">Ne pas remplir ce champ</label>
        <input
          id="botcheck"
          name="botcheck"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nom complet *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            placeholder="Jean Dupont"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Adresse e-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={120}
            placeholder="jean.dupont@exemple.fr"
            className={inputClasses}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="company"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Entreprise
        </label>
        <input
          id="company"
          name="company"
          type="text"
          maxLength={100}
          placeholder="Nom de votre entreprise"
          className={inputClasses}
        />
      </div>
      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Sujet *
        </label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          className={inputClasses}
        >
          <option value="" disabled>
            Choisissez un sujet…
          </option>
          <option value="Devis">Demande de devis</option>
          <option value="Démonstration">Démonstration</option>
          <option value="Support technique">Support technique</option>
          <option value="Partenariat">Partenariat</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Votre message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Décrivez votre besoin..."
          className={inputClasses}
        />
      </div>

      {status === "error" && error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 px-4 py-3 text-sm text-red-800 dark:text-red-300"
        >
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none sm:w-auto"
      >
        {status === "submitting" ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}

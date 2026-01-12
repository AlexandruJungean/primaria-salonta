import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Numele trebuie să aibă cel puțin 2 caractere')
    .max(100, 'Numele nu poate depăși 100 de caractere'),
  email: z.string()
    .email('Adresa de email nu este validă'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[0-9+\-\s()]+$/.test(val), {
      message: 'Numărul de telefon nu este valid',
    }),
  subject: z.string()
    .min(3, 'Subiectul trebuie să aibă cel puțin 3 caractere')
    .max(200, 'Subiectul nu poate depăși 200 de caractere'),
  message: z.string()
    .min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere')
    .max(5000, 'Mesajul nu poate depăși 5000 de caractere'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Petition form schema
export const petitionFormSchema = z.object({
  tipPersoana: z.enum(['fizica', 'juridica']),
  // Person fields
  nume: z.string().optional(),
  prenume: z.string().optional(),
  // Company fields
  denumire: z.string().optional(),
  reprezentant: z.string().optional(),
  cui: z.string().optional(),
  // Common fields
  email: z.string().email('Adresa de email nu este validă'),
  telefon: z.string().optional(),
  // Address
  tara: z.string().min(2, 'Țara este obligatorie'),
  judet: z.string().min(2, 'Județul este obligatoriu'),
  localitate: z.string().min(2, 'Localitatea este obligatorie'),
  adresa: z.string().min(5, 'Adresa este obligatorie'),
  // Message
  mesaj: z.string()
    .min(20, 'Mesajul trebuie să aibă cel puțin 20 de caractere')
    .max(10000, 'Mesajul nu poate depăși 10000 de caractere'),
}).refine((data) => {
  // Validate person-specific fields
  if (data.tipPersoana === 'fizica') {
    return data.nume && data.nume.length >= 2 && data.prenume && data.prenume.length >= 2;
  } else {
    return data.denumire && data.denumire.length >= 2 && data.reprezentant && data.reprezentant.length >= 2;
  }
}, {
  message: 'Completați toate câmpurile obligatorii pentru tipul de persoană selectat',
  path: ['tipPersoana'],
});

export type PetitionFormData = z.infer<typeof petitionFormSchema>;

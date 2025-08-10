export const createAppointment = async (data: Record<string, unknown>) => {
  const url = import.meta.env.VITE_FIREBASE_APPOINTMENT_URL;
  const token = import.meta.env.VITE_FIREBASE_APP_TOKEN;
  if (!url) {
    throw new Error('Firebase appointment function URL non définie');
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-App-Token'] = token;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erreur lors de la création du rendez-vous");
  }
};

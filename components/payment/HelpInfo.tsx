

export const HelpInfo = () => {
  return (
    <div className="mt-8 bg-secondary/30 rounded-xl p-6">
      <h3 className="text-white text-lg font-medium mb-4">Besoin d'aide ?</h3>
      <p className="text-sm text-gray-400 mb-4">
        Si vous avez des questions concernant l'inscription, n'hésitez pas à
        nous contacter.
      </p>
      <div className="space-y-2 text-sm">
        <p className="flex items-center text-gray-300">
          <svg
            className="h-4 w-4 text-primary mr-2"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          +32 473 99 91 70
        </p>
        <p className="flex items-center text-gray-300">
          <svg
            className="h-4 w-4 text-primary mr-2"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect height="16" rx="2" width="20" x="2" y="4" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          info@befa-academy.be
        </p>
      </div>
    </div>
  );
};

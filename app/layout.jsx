import "./globals.css";

export const metadata = {
  title: "Cadastro de Casas",
  description: "Cadastro de casas por território",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

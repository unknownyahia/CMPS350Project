// app/MainLayout.jsx
import "../styles/base.css";

export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Course Management</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

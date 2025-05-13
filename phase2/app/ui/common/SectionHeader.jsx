// app/ui/common/SectionHeader.jsx
/**
 * Renders a section heading.
 *
 * @param {object} props
 * @param {string} props.text – The heading text
 */
export default function SectionHeader({ text }) {
  return (
    <header className="section-header">
      <h2>{text}</h2>
    </header>
  );
}

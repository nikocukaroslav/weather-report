export function BackButton({ setActiveIndex }) {
  return (
    <button className="button" onClick={() => setActiveIndex(null)}>
      <span className="back-arrow">&larr;</span> Back
    </button>
  );
}

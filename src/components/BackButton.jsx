export function BackButton({ setActiveIndex }) {
  return (
    <button className="button" onClick={() => setActiveIndex(null)}>
      Back
    </button>
  );
}

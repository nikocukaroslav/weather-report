export function Input({ setCity, city }) {
  return (
    <div className="choose-city">
      <label>Your city:</label>
      <input
        type="text"
        className="choose-city-input"
        value={city}
        placeholder="New York"
        onChange={(e) => setCity(e.target.value)}
      />
    </div>
  );
}

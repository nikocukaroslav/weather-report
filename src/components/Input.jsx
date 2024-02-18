export function Input({ setCity, city }) {
  return (
    <div className="choose-city">
      <label>Your city:</label>
      <input
        type="text"
        className="choose-city-input"
        value={city}
        placeholder="New York"
        list="city"
        onChange={(e) => setCity(e.target.value)}
      />
      <datalist id="city">
        <option value="Kyiv" />
        <option value="Zhitomir" />
        <option value="Poltava" />
        <option value="Lviv" />
        <option value="Odessa" />
        <option value="Kharkiv" />
      </datalist>
    </div>
  );
}

import './Station.css';

const Station = ({ label }) => {
  return (
    <div className="Station">
      <p className="Station-label">{label}</p>
    </div>
  );
};

export default Station;
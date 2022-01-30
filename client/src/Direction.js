import './Direction.css';

const Direction = ({ label }) => {
  return (
    <div className="Direction">
      <p className="Direction-label">{label}</p>
    </div>
  );
};

export default Direction;
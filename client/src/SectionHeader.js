import './SectionHeader.css';

const SectionHeader = ({ label }) => {
  return (
    <div className="SectionHeader">
      <p className="SectionHeader-label">{label}</p>
    </div>
  );
};

export default SectionHeader;
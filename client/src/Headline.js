import './Headline.css';

const Headline = ({ title }) => {
  return (
    <div className="Headline">
      <p className="Headline-title">{title}</p>
    </div>
  );
};

export default Headline;
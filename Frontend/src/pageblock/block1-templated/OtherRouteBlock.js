import logo from './logo.svg';
import './OtherRouteBlock.css';

function OtherRouteBlock() {
  return (
    <div className="other-route-react-block">
      <header className="other-route-react-block-header">
        <img src={logo} className="block1-logo" alt="react-block-logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="block1-link"
          href="/"
        >
          Back to /
        </a>
      </header>
    </div>
  );
}

export default OtherRouteBlock;

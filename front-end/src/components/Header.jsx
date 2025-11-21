import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="left">
        <a href="#"><p>Cid.inform</p></a>
      </div>
      <div className="right">
        <ul>
          <li><a href="#">Login</a></li>
          <li><a href="#">Contato</a></li>
          <li><a href="#">Sobre</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;

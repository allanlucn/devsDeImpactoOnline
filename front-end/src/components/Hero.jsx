import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>Bem vindo ao Cid.Inform</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique nisi odio beatae aperiam cum id quasi, perferendis sapiente assumenda. Commodi molestias facilis earum debitis, quidem magnam quibusdam iste! Nemo, repudiandae?
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate('/chat')}>Pergunte</button>
          <button className="btn-secondary">Cadastre-se</button>
        </div>
      </div>
      <div className="right">
        <div className="image-placeholder">Imagem</div>
      </div>
    </section>
  );
};

export default Hero;

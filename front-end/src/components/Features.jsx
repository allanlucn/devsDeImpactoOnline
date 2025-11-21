import React from 'react';

const services = [
  {
    title: 'Serviço 1',
    description: 'Descrição do serviço 1. Muito bom e eficiente.',
  },
  {
    title: 'Serviço 2',
    description: 'Descrição do serviço 2. Rápido e seguro.',
  },
  {
    title: 'Serviço 3',
    description: 'Descrição do serviço 3. O melhor do mercado.',
  },
];

const Features = () => {
  return (
    <section className="content">
      <h2>Nossos Serviços</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eius facere minima blanditiis eligendi.</p>
      <div className="cards">
        {services.map((service, index) => (
          <div className="card" key={index}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

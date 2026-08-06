import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../../common/Card/Card';
import { Button } from '../../common/Button/Button';
import './Blog.css';

const posts = [
  {
    id: 1,
    title: 'Como abrir sua empresa de forma digital em 2024',
    excerpt: 'Aprenda o passo a passo para abrir sua empresa totalmente online, sem burocracia e sem sair de casa.',
    category: 'Abrir Empresa',
    date: '15 Jun 2024',
    image: null,
  },
  {
    id: 2,
    title: 'Contabilidade para Médicos: guia completo',
    excerpt: 'Entenda as particularidades da contabilidade para profissionais da saúde e como otimizar seus impostos.',
    category: 'Contabilidade',
    date: '10 Jun 2024',
    image: null,
  },
  {
    id: 3,
    title: 'MEI pode contratar funcionário? Saiba tudo',
    excerpt: 'Tire todas as suas dúvidas sobre contratação de funcionários sendo MEI e as obrigações trabalhistas.',
    category: 'MEI',
    date: '05 Jun 2024',
    image: null,
  },
  {
    id: 4,
    title: 'Benefícios fiscais para empresas de TI',
    excerpt: 'Descubra os principais benefícios fiscais disponíveis para empresas de tecnologia e como aproveitá-los.',
    category: 'Impostos',
    date: '28 Mai 2024',
    image: null,
  },
  {
    id: 5,
    title: 'Trocar de contador: quando e como fazer',
    excerpt: 'Saiba identificar o momento certo para trocar de contador e como fazer a migração sem complicações.',
    category: 'Contabilidade',
    date: '20 Mai 2024',
    image: null,
  },
  {
    id: 6,
    title: 'Planejamento tributário para pequenas empresas',
    excerpt: 'Entenda a importância do planejamento tributário e como ele pode economizar dinheiro para sua empresa.',
    category: 'Impostos',
    date: '15 Mai 2024',
    image: null,
  },
];

export const Blog = () => {
  return (
    <section className="blog section section-white" id="blog">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <h2>Blog</h2>
          <p>Artigos e conteúdos sobre contabilidade, empreendedorismo e gestão empresarial</p>
        </div>

        <div className="blog-grid">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="animate-on-scroll"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <Card>
                <CardHeader>
                  <div className="blog-image-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  </div>
                </CardHeader>
                <CardBody>
                  <span className="blog-category">{post.category}</span>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                </CardBody>
                <CardFooter>
                  <div className="blog-footer">
                    <span className="blog-date">{post.date}</span>
                    <Button variant="ghost" size="small">Ler mais</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

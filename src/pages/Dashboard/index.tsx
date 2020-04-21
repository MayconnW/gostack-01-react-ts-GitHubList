import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from 'services/api';

import { FiChevronRight } from 'react-icons/fi';
import logoImg from 'assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() =>
    JSON.parse(localStorage.getItem('@GitHubExplorer:repositories') || '[]'),
  );

  async function handleAddRepository(
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    if (newRepo === '') {
      setInputError('Por favor digite o autor/nome do repositório');
      return;
    }
    try {
      const { data } = await api.get<Repository>(`repos/${newRepo}`);
      setRepositories([...repositories, data]);
      setNewRepo('');
      setInputError('');
    } catch {
      setInputError('Autor e/ou repositório não encontrado');
    }
  }

  useEffect(() => {
    localStorage.setItem(
      '@GitHubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  return (
    <>
      <img src={logoImg} alt="Logo Github" />
      <Title>Explore repositórios no GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite aqui o nome do respositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(item => (
          <Link to={`/repositories/${item.full_name}`} key={item.full_name}>
            <img src={item.owner.avatar_url} alt={item.owner.login} />
            <div>
              <strong>{item.full_name}</strong>
              <p>{item.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;

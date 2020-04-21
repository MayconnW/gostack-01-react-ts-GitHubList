import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import api from 'services/api';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Logo from 'Components/Logo';

import { Header, RepositoryContainer, Issues } from './styles';

interface RepositoryResponse {
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

interface RepositoryRequest {
  repository: string;
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryRequest>();
  const [repository, setRepository] = useState<RepositoryResponse | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const url = `repos/${params.repository}`;
    api.get<RepositoryResponse>(url).then(({ data }) => {
      setRepository(data);
    });

    api.get<Issue[]>(`${url}/issues`).then(({ data }) => {
      setIssues(data);
    });
  }, [params]);

  return (
    <>
      <Header>
        <Logo />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>
      {repository && (
        <RepositoryContainer>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues Abertas</span>
            </li>
          </ul>
        </RepositoryContainer>
      )}

      <Issues>
        {issues.map(item => (
          <a
            href={item.html_url}
            key={item.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              <strong>{item.title}</strong>
              <p>{item.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;

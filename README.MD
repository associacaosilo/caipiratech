# Mapa das cozinhas

Projeto em colaboração com o Conselho Nacional de Segurança Alimentar e Nutricional (Consea) para realização de mapeamento de cozinhas comunitárias.

## Para levantar o ambiente local, via docker

- É preciso ter [instalado o Docker](https://www.docker.com/get-started/) em sua máquina
- Clone o projeto 
- No arquivo [Gemfile](Gemfile) comente as linhas 5 e 10 e descomente a linha 9 de modo que fique assim

```
# frozen_string_literal: true

source "https://rubygems.org"

#git_source(:github) { |repo_name| "https://github.com/#{repo_name}" }

# gem "rails"

gem "jekyll", "~> 4.2"
#gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
   gem "jekyll-feed"
end
```

- Necessário também comentar a linha 4 do arquivo [assets/css/main.scss](assets/css/main.scss)
- Dentro da pasta do projeto, execute o ``comando docker compose up -d``
- Acesse a ulr <http://0.0.0.0:4000/> pelo navegador
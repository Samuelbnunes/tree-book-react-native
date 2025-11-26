# Tree Book (React Native)

Este é um aplicativo de exemplo desenvolvido com React Native, uma plataforma de e-books.

## Visão Geral

O aplicativo `Tree Book` possui funcionalidades como:

* Autenticação de usuário (Login/Cadastro)
* Visualização de inventário de produtos
* Carrinho de compras
* Gerenciamento de imagens

A estrutura do projeto utiliza React Navigation para o roteamento e o padrão de Context API para gerenciamento de estado global (`AuthContext`, `InventoryContext`, `CartContext`, `ImageContext`).

## Pré-requisitos

Antes de começar, certifique-se de ter o ambiente de desenvolvimento React Native configurado em sua máquina.

Você pode seguir o guia oficial na seção **"React Native CLI Quickstart"**:
* Guia de configuração do ambiente React Native

Resumidamente, você precisará de:
- Node.js (versão LTS)
- Watchman (para usuários de macOS)
- Um emulador Android (via Android Studio) ou um simulador iOS (via Xcode)

## Como Executar o Projeto

1.  **Clone o repositório**

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd tree-book-react-native
    ```

2.  **Instale as dependências**

    Usando npm:
    ```bash
    npm install
    ```

    Ou usando Yarn:
    ```bash
    yarn install
    ```

3.  **Inicie o aplicativo**

    * **Para Android:**
        ```bash
        npx react-native run-android
        ```
    * **Para iOS:**
        ```bash
        npx react-native run-ios
        ```

Após executar um dos comandos acima, o Metro Bundler será iniciado e o aplicativo será instalado e aberto no seu emulador/simulador ou dispositivo físico conectado.

***

## ⚠️ Ponto de Atenção para APIs Locais (Localhost)

Ao usar a API localmente com emuladores React Native, o endereço padrão `localhost` **não funcionará** para se conectar à sua máquina hospedeira (onde a API está rodando).

Para corrigir isso, você deve **atualizar o `baseURL`** nos seguintes arquivos de serviço com o **endereço IP da sua máquina** na rede local:

* `src/services/AuthService.js`
* `src/services/CartService.js`
* `src/services/InventoryService.js`
* `src/services/ReviewService.js`

**Exemplo (conforme a sugestão nos arquivos de serviço):**

* Para Emulador Android: use `http://10.0.2.2:<PORTA>`
* Para Celular Físico/Rede Local: use o IP da sua máquina, como `http://192.168.X.X:<PORTA>`

A configuração atual nos arquivos de serviço está mocado para o IP: `http://localHost:8765`. Certifique-se de que este IP seja o correto para o seu ambiente ou altere-o conforme a necessidade.
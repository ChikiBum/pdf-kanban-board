# PDF Kanban Board

A multi-tenant document management system with a Trello-like kanban interface for managing PDF documents through a workflow with states: Received, In Review, Approved, Signed, and On Hold.

## Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Shared**: TypeScript types and validation with Zod
- **Package Manager**: Yarn (with workspaces)
- **Code Quality**: Biome (formatting, linting, type checking)
- **Git Hooks**: Husky with pre-commit and pre-push hooks

## Project Structure

```
pdf-kanban-board/
├── .husky/            # Git hooks configuration
├── .vscode/           # VSCode settings
├── packages/          # Monorepo packages
│   ├── frontend/      # React frontend application (Vite + TypeScript)
│   ├── backend/       # Express backend server (TypeScript)
│   └── shared/        # Shared types and utilities
├── .gitignore         # Git ignore rules
├── .yarnrc.yml        # Yarn configuration
├── biome.json         # Biome (formatter/linter) configuration
├── package.json       # Root package.json with workspaces
├── README.md          # This file
├── tsconfig.base.json # Base TypeScript configuration
└── yarn.lock          # Yarn lock file
```

## Prerequisites

- Node.js 18+
- Yarn 1.22+ (or npm 9+)
- Git
- [Husky](https://typicode.github.io/husky/) - Git hooks manager
- [Biome](https://biomejs.dev/) - For formatting and linting

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdf-kanban-board
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up Git hooks**
   ```bash
   yarn prepare
   ```
   This will set up Husky and prepare all Git hooks.

## Development Workflow

### Code Quality

- **Formatting**: Uses Biome for consistent code formatting
  ```bash
  yarn format           # Format all files
  yarn format:check     # Check formatting without making changes
  ```

- **Linting**:
  ```bash
  yarn lint            # Lint all files
  yarn check           # Type checking and linting
  ```

### Git Hooks

- **Pre-commit**: Automatically runs `lint-staged` to check and format staged files
- **Pre-push**: Runs `yarn lint && yarn type-check` before pushing to remote

## 🏃‍♂️ Development

### Start development servers

**Option 1: Start both frontend and backend in development mode (recommended)**

```bash
yarn dev
```

**Option 2: Start services separately**

In separate terminals:

```bash
# Terminal 1 - Backend
yarn workspace @pdf-kanban-board/backend dev

# Terminal 2 - Frontend
yarn workspace @pdf-kanban-board/frontend dev
```

## 📜 Available Scripts

### Root commands:

```bash
# Install all dependencies
yarn install

# Start both frontend and backend in development mode
yarn dev

# Run type checking
yarn type-check

# Build all packages
yarn build
```

### Frontend-specific:

```bash
# Start development server
yarn workspace @pdf-kanban-board/frontend dev

# Build for production
yarn workspace @pdf-kanban-board/frontend build

# Preview production build
yarn workspace @pdf-kanban-board/frontend preview
```

### Backend-specific:

```bash
# Start development server
yarn workspace @pdf-kanban-board/backend dev

# Build for production
yarn workspace @pdf-kanban-board/backend build

# Start production server
yarn workspace @pdf-kanban-board/backend start
```

## 📦 Workspace Management

- List all workspaces: `yarn workspaces list`
- Run command in specific workspace: `yarn workspace @pdf-kanban-board/frontend <command>`
- Run command in all workspaces: `yarn workspaces run <command>`

## 🌐 Environment Variables

Create `.env` files in respective packages:

**Frontend** (`packages/frontend/.env`):
```
VITE_API_URL=http://localhost:3001
```

**Backend** (`packages/backend/.env`):
```
PORT=3001
NODE_ENV=development
```

## 🧪 Testing

```bash
# Run tests in all workspaces
yarn test

# Run tests in specific workspace
yarn workspace @pdf-kanban-board/frontend test
```

## 🏗️ Building for Production

```bash
# Build all packages
yarn build

# Or build specific package
yarn workspace @pdf-kanban-board/frontend build
yarn workspace @pdf-kanban-board/backend build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Express](https://expressjs.com/)
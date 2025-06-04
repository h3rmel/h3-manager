# H3 Manager

## Introduction

H3 Manager is a modern web application built with Next.js that allows you to manage Vercel projects and deployments in a simplified way. The application provides an intuitive interface to view, filter, and manage deployments of projects hosted on the Vercel platform.

### Key features:

- **Project visualization**: Lists all available projects in your Vercel account
- **Deployment management**: Displays deployments with detailed information such as URL, status, creation date, and creator
- **Date filtering**: Allows filtering deployments by specific time periods
- **Batch deletion**: Enables selecting and deleting multiple deployments simultaneously
- **Modern interface**: Responsive design with light/dark theme support
- **Real-time monitoring**: Tracks the progress of deletion operations

## How to run

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (package manager)
- Vercel account with access token

### Step by step

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd h3-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   You need to configure the Vercel token in the `src/lib/vercel.ts` file. Replace the current token with your personal Vercel token:
   
   ```typescript
   const vercel = new Vercel({
     bearerToken: "YOUR_TOKEN_HERE",
   });
   ```
   
   > **Note**: To get your Vercel token, visit your [account settings](https://vercel.com/account/tokens) and generate a new token.

4. **Run the project in development mode**
   ```bash
   pnpm dev
   ```

5. **Access the application**
   
   Open your browser and go to: `http://localhost:3000`

### Available scripts

- `pnpm dev` - Runs the project in development mode with Turbopack
- `pnpm build` - Generates the production build
- `pnpm start` - Runs the application in production mode
- `pnpm lint` - Runs the linter to check the code

### Technologies used

- **Next.js 15.3.3** - React framework for production
- **React 19** - Library for building user interfaces
- **TypeScript** - JavaScript superset with static typing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible and customizable components
- **Vercel SDK** - Official Vercel SDK for integration
- **Lucide React** - Icon library

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

**Developed with ❤️ using Next.js and TypeScript**

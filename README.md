# Simple Todo List

A full-stack todo list application powered by AI agents, accessible through both web interface and WhatsApp.

## Live Demo

Access the application at: **https://simple-todo-list-blush.vercel.app**

## Features

- Create, read, update, and delete tasks
- AI-powered natural language task management
- Multi-channel access (Web + WhatsApp)
- User-specific task isolation
- Persistent conversation memory

## Architecture

### Dual-Agent System

This application uses a unified n8n workflow that powers **two separate agents**:

#### 1. Web Agent
- Access via the web interface at https://simple-todo-list-blush.vercel.app
- Direct API communication
- Real-time responses through webhook
- REST API endpoint: `/api/todos`

#### 2. WhatsApp Agent
- Send messages to the configured WhatsApp number
- Prefix messages with `#to-do list` followed by your command
- Examples:
  - `#to-do list show my tasks`
  - `#to-do list add buy groceries`
  - `#to-do list mark first task as complete`
  - `#to-do list delete last task`

### Shared Workflow

Both agents use the **same n8n AI workflow** (`Todo List AI Agent`), which:
- Routes requests based on source (web or WhatsApp)
- Maintains conversation context per user via Redis memory
- Uses Claude Sonnet 4 for natural language understanding
- Executes CRUD operations through sub-workflows
- Returns responses to the appropriate channel

### Workflow Components

1. **Main Agent Workflow**: `Todo List AI Agent`
   - Handles both web and WhatsApp webhooks
   - AI-powered task interpretation
   - Source-aware response routing

2. **Tool Workflows** (Sub-workflows):
   - `Tool - List Todos`: Fetch all user tasks
   - `Tool - Create Todo`: Add new tasks
   - `Tool - Update Todo`: Modify task title or status
   - `Tool - Delete Todo`: Remove tasks

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **AI/Automation**: n8n, Claude Sonnet 4 (Anthropic)
- **Memory**: Redis (conversation context)
- **Deployment**: Vercel (web), Cloudfy (n8n + Evolution API)

## API Authentication

All API requests require the `X-API-Key` header for security.

## User Identification

Tasks are isolated per user using a `user_identifier`:
- **Web**: Generated or provided by the user
- **WhatsApp**: Automatically extracted from phone number

## Getting Started

### Web Interface
1. Visit https://simple-todo-list-blush.vercel.app
2. Enter your user identifier
3. Start managing your tasks through the chat interface

### WhatsApp
1. Save the configured WhatsApp number
2. Send: `#to-do list [your command]`
3. Receive AI-powered task management responses

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- n8n instance
- Anthropic API key

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
API_KEY=your_api_key
```

### Installation
```bash
npm install
npm run dev
```

## License

MIT

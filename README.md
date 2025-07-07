# ElevenLabs Orb Widget

A modern, centered conversational AI widget built with Next.js 14, TypeScript, and the ElevenLabs React SDK. This project transforms the default corner-positioned ElevenLabs widget into a prominent, orb-style interface similar to modern AI assistants.

## Features

- **Centered Orb Interface**: Large, prominent 4-segment orb with gradient animations
- **Animation States**: 
  - Idle: Static orb with subtle gradient shifts
  - Listening: Floating segments with independent movement
  - Speaking: Rotating orb with volume-responsive scaling
- **Responsive Design**: Mobile-optimized with touch-friendly controls
- **Real-time Transcript**: Optional transcript display with toggle
- **Error Handling**: Comprehensive error handling and fallback states
- **Accessibility**: ARIA labels and keyboard navigation support

## Quick Start

### Prerequisites

- Node.js 18 or higher
- ElevenLabs account with a configured Conversational AI agent

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` and add your ElevenLabs Agent ID:
```
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your-agent-id-here
```

### Getting Your Agent ID

1. Go to the [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
2. Create or select a Conversational AI agent
3. Make sure your agent is configured as **"Public"** for web usage
4. Copy the Agent ID from the dashboard

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── ConversationalAI/     # Main widget component
│   │   └── index.tsx
│   └── AnimatedOrb/          # Orb visualization component
│       └── index.tsx
├── hooks/
│   └── useElevenLabsConversation.ts  # ElevenLabs SDK integration
└── app/
    ├── page.tsx              # Main page with Agent ID input
    └── layout.tsx            # Root layout
```

## Key Components

### ConversationalAI
The main widget component that handles the full-screen overlay, controls, and user interface.

### AnimatedOrb
A 4-segment orb component with smooth animations that respond to conversation states.

### useElevenLabsConversation
A custom hook that wraps the ElevenLabs `useConversation` hook with additional state management.

## Configuration

### Agent Setup
Make sure your ElevenLabs agent is configured properly:
- Set as "Public" in the dashboard
- Test the agent in the ElevenLabs interface first
- Ensure microphone permissions are granted

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support with some limitations
- Mobile browsers: Optimized responsive design

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

### Common Issues

1. **Agent ID not working**: Ensure your agent is set to "Public" in the ElevenLabs dashboard
2. **Microphone not working**: Check browser permissions and ensure HTTPS in production
3. **Connection issues**: Verify your agent is active and properly configured

### Debug Mode

The widget includes comprehensive error handling. Check the browser console for detailed error messages.

## License

MIT License - see LICENSE file for details.

'use client';

import ConversationalAI from '../components/ConversationalAI';

export default function Home() {
  const agentId = 'agent_01jzhk84hefhgvgwxzdy2me7fg';

  return (
    <div className="min-h-screen">
      <ConversationalAI
        agentId={agentId}
        className="z-50"
      />
    </div>
  );
}

import { useState } from 'react';
import { ChatLayout } from '../components/ChatLayout';
import { MicrosoftAnswerDisplay } from '../components/MicrosoftAnswerDisplay';
import { MicrosoftInput } from '../components/MicrosoftInput';
import { useChatStream } from '../hooks/useChatStream';
import { Sparkles } from 'lucide-react';

type RAGMode = 'fast-rag' | 'agentic-rag' | 'deep-research-rag';

export function QAWithVerification() {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<RAGMode>('fast-rag');
  const { 
    messages, 
    citations, 
    queryRewrites, 
    tokenUsage, 
    processingMetadata, 
    isLoading, 
    isStreaming,
    sendMessage
  } = useChatStream(selectedMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      await sendMessage(query);
      setQuery('');
    }
  };


  const currentMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const hasResults = currentMessage && currentMessage.role === 'assistant';

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Content Area */}
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            {!hasResults && !isLoading && (
              <div className="space-y-8">
                {/* Welcome Message */}
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    QA with Verification
                  </h2>
                  <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                    Get intelligent, verified answers with comprehensive source citations
                  </p>
                </div>

                {/* Microsoft Input */}
                <MicrosoftInput
                  query={query}
                  setQuery={setQuery}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  showSourceSelector={true}
                  placeholder="Ask anything about Microsoft..."
                  hideExampleQuestions={false}
                />
              </div>
            )}

            {/* Results */}
            {(hasResults || isLoading) && (
              <div className="space-y-6">
                <MicrosoftInput
                  query={query}
                  setQuery={setQuery}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  showSourceSelector={true}
                  placeholder="Ask anything about Microsoft..."
                  hideExampleQuestions={true}
                />
                
                <MicrosoftAnswerDisplay
                  messages={messages}
                  citations={citations}
                  queryRewrites={queryRewrites}
                  tokenUsage={tokenUsage}
                  processingMetadata={processingMetadata}
                  isStreaming={isStreaming}
                  ragMode={selectedMode}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
